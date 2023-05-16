import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
  MutableRefObject,
} from "react";
import Image from "next/image";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

import UserContext from "context/User";
import { useUserMedia } from "hooks/useUserMedia";

import MicrophoneButton from "components/controls/buttons/MicrophoneButton";
import CameraButton from "components/controls/buttons/CameraButton";

import muxLogo from "../public/mux-logo.svg";

interface Props {
  onInteraction: () => void;
  participantNameRef: MutableRefObject<string>;
}

export default function UserInteractionPrompt({
  onInteraction,
  participantNameRef,
}: Props): JSX.Element {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const didPopulateDevicesRef = useRef(false);
  const user = useContext(UserContext);
  const [participantName, setParticipantName] = useState("");
  const [hasBlurredNameInput, setHasBlurredNameInput] = useState(false);

  const { requestPermissionAndPopulateDevices } = useUserMedia();

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setParticipantName(user.participantName);
  }, [user.participantName]);

  const isNameInputInvalid = useMemo(
    () => !participantName && hasBlurredNameInput,
    [participantName, hasBlurredNameInput]
  );

  const handleParticipantNameChange = (event: {
    target: { value: string };
  }) => {
    setParticipantName(event.target.value);
  };

  useEffect(() => {
    if (didPopulateDevicesRef.current === false) {
      didPopulateDevicesRef.current = true;
      requestPermissionAndPopulateDevices();
    }
  }, [requestPermissionAndPopulateDevices]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    participantNameRef.current = participantName;
    user.setParticipantName(participantName);
    user.setInteractionRequired(false);
    onInteraction();
  };

  return (
    <Flex
      gap="2rem"
      height="100%"
      overflow="hidden"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Image
        priority
        alt="logo"
        width={300}
        src={muxLogo}
        style={{ zIndex: 0, height: "auto" }}
      />
      <form onSubmit={handleSubmit}>
        <Stack spacing="4">
          <FormControl
            isInvalid={isNameInputInvalid}
            onBlur={() => setHasBlurredNameInput(true)}
          >
            <FormLabel textAlign="center" color="white">
              Enter your name
            </FormLabel>
            <Input
              placeholder="Your name"
              color="white"
              size="lg"
              maxLength={40}
              id="participant_name"
              value={participantName}
              onChange={handleParticipantNameChange}
              variant="flushed"
              isRequired={true}
              ref={nameInputRef}
            />
            <FormHelperText
              color={!isNameInputInvalid ? "transparent" : "#E22C3E"}
            >
              This cannot be empty.
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            isDisabled={!participantName}
            size="lg"
            rightIcon={<HiOutlineArrowNarrowRight />}
            variant="flushed"
            color="white"
          >
            Join Space
          </Button>
        </Stack>
      </form>
      <HStack marginTop="2rem">
        <MicrophoneButton />
        <CameraButton />
      </HStack>
    </Flex>
  );
}
