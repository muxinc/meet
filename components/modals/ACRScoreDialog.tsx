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
        color="#242628"
        fontSize="14px"
        cursor="pointer"
        borderWidth="1px"
        borderRadius="5px"
        borderColor="#B2BAC2"
        _checked={{
          background: "#3E4247",
          color: "white",
          borderColor: "#3E4247",
        }}
        _hover={
          !props.isChecked
            ? {
                borderColor: "#242628",
              }
            : {}
        }
        _focus={{
          boxShadow: "none",
        }}
        px="20px"
        py="10px"
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

        <AlertDialogContent borderRadius="0px">
          <AlertDialogHeader
            color="#242628"
            fontSize="18px"
            fontWeight="normal"
          >
            How was the call quality?
          </AlertDialogHeader>
          <AlertDialogCloseButton
            color="#666666"
            marginTop="6px"
            marginRight="3px"
          />
          <Divider color="#E8E8E8" opacity={1} />
          <AlertDialogBody my="17px">
            <VStack {...group} spacing="10px">
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
            <Button ref={cancelRef} variant="muxDefault" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="muxConfirmation"
              isLoading={submitting}
              isDisabled={disableSubmission}
              onClick={handleSubmittingAcrScore}
              marginLeft="10px"
            >
              Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
