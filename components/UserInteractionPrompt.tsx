import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button, Flex, HStack } from "@chakra-ui/react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

import UserContext from "context/User";
import { useUserMedia } from "hooks/useUserMedia";

import MicrophoneButton from "components/controls/buttons/MicrophoneButton";
import CameraButton from "components/controls/buttons/CameraButton";

import muxLogo from "../public/mux-logo.svg";

interface Props {
  onInteraction: () => void;
}

export default function UserInteractionPrompt({
  onInteraction,
}: Props): JSX.Element {
  const didPopulateDevicesRef = useRef(false);
  const { setInteractionRequired } = React.useContext(UserContext);
  const { requestPermissionAndPopulateDevices } = useUserMedia();

  useEffect(() => {
    if (didPopulateDevicesRef.current === false) {
      didPopulateDevicesRef.current = true;
      requestPermissionAndPopulateDevices();
    }
  }, [requestPermissionAndPopulateDevices]);

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
        height={70}
        src={muxLogo}
        style={{ zIndex: 0 }}
      />
      <Button
        size="lg"
        rightIcon={<HiOutlineArrowNarrowRight />}
        variant="link"
        color="white"
        onClick={() => {
          setInteractionRequired(false);
          onInteraction();
        }}
      >
        Join Space
      </Button>
      <HStack>
        <MicrophoneButton />
        <CameraButton />
      </HStack>
    </Flex>
  );
}
