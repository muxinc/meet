import React, { useCallback, useRef, useState } from "react";
import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
  Box,
  useRadio,
  useRadioGroup,
  VStack,
  RadioProps,
  Divider,
} from "@chakra-ui/react";
import { AcrScore } from "@mux/spaces-web";

import { useSpace } from "hooks/useSpace";

function RadioCard(props: RadioProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" width="100%">
      <input {...input} />
      <Box
        {...checkbox}
        color="#666666"
        fontSize="14px"
        cursor="pointer"
        borderWidth="1px"
        borderRadius="2px"
        borderColor="#CCCCCC"
        _checked={{
          bg: "#444444",
          color: "white",
          borderColor: "#444444",
        }}
        _hover={
          !props.isChecked
            ? {
                bg: "#F4F4F4",
                color: "#666666",
              }
            : {}
        }
        _focus={{
          boxShadow: "none",
        }}
        px={3}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}

type Props = Pick<ReturnType<typeof useDisclosure>, "isOpen" | "onClose">;

const options = ["Excellent", "Good", "Fair", "Poor", "Bad"];

export default function ACRScoreDialog({ isOpen, onClose }: Props) {
  const cancelRef = useRef(null);
  const { submitAcrScore } = useSpace();
  const [acrScore, setAcrScore] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "acr",
    onChange: (nextValue) => setAcrScore(nextValue),
  });

  const handleSubmittingAcrScore = useCallback(async () => {
    if (acrScore) {
      setSubmitting(true);
      const numericScore = AcrScore[acrScore as keyof typeof AcrScore];
      try {
        await submitAcrScore(numericScore);
      } catch (e) {
        console.error(e);
      }
      onClose();
    }
  }, [acrScore, submitAcrScore, onClose]);

  const handleClose = useCallback(() => {
    setClosing(true);
    onClose();
  }, [onClose]);

  const group = getRootProps();
  const disableSubmission = closing || !acrScore;

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={handleClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader color="#666666" fontSize="18px" fontWeight="400">
            How was the call quality?
          </AlertDialogHeader>
          <AlertDialogCloseButton
            color="#666666"
            marginTop="6px"
            marginRight="3px"
          />
          <Divider color="#E8E8E8" opacity={1} />
          <AlertDialogBody my="17px">
            <VStack {...group} spacing="15px">
              {options.map((value) => {
                const radio = getRadioProps({ value });
                return (
                  <RadioCard key={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              height="100%"
              border="1px solid #E8E8E8"
              borderRadius="3px"
              fontSize="14px"
              bg="white"
              color="#666666"
              fill="#666666"
              flexDirection="row"
              marginLeft="10px"
              padding="10px 20px"
              onClick={handleClose}
              _hover={{
                background: "#FFFFFF",
                border: "1px solid #666666",
                color: "#666666",
                fill: "#666666",
              }}
            >
              Cancel
            </Button>
            <Button
              isLoading={submitting}
              disabled={disableSubmission}
              height="100%"
              background="gradient"
              border="1px solid white"
              borderRadius="3px"
              fontSize="14px"
              color="white"
              fill="white"
              flexDirection="row"
              marginLeft="10px"
              padding="10px 20px"
              onClick={handleSubmittingAcrScore}
              _hover={
                disableSubmission
                  ? {}
                  : {
                      background: "#FFFFFF",
                      border: "1px solid #999999",
                      color: "#666666",
                      fill: "#666666",
                    }
              }
            >
              Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
