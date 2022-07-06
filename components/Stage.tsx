import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Spinner,
  Center,
  Flex,
  useDisclosure,
  useToast,
  Box,
  ToastId,
} from "@chakra-ui/react";
import { SpaceEvent } from "@mux/spaces-web";

import { useSpace } from "hooks/useSpace";
import { useDevices } from "hooks/useDevices";
import { useScreenShare } from "hooks/useScreenShare";

import ErrorModal from "./modals/ErrorModal";
import ScreenShareLayout from "./ScreenShareLayout";
import Gallery from "./Gallery";
import SpaceMan from "./SpaceMan";
import Controls from "./Controls";

import {
  broadcastingToastId,
  sharingScreenToastConfig,
  ToastIds,
  viewingSharedScreenToastId,
} from "shared/toastConfigs";

export default function Stage(): JSX.Element {
  const toast = useToast();
  const { space, joinError } = useSpace();
  const { userMediaError } = useDevices();
  const {
    screenShareTrack,
    screenShareError,
    participantScreenSharing,
    isLocalScreenShare,
    toggleScreenShare,
  } = useScreenShare();
  const screenShareToastIdRef = useRef<ToastId | undefined>();
  const broadcastingToastIdRef = useRef<ToastId | undefined>();
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onErrorModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (joinError) {
      setErrorModalTitle("Error joining space");
      setErrorModalMessage(joinError);
      onErrorModalOpen();
    }
  }, [joinError, onErrorModalOpen]);

  useEffect(() => {
    if (screenShareError === "Permission denied by system") {
      setErrorModalTitle("Can't share your screen");
      setErrorModalMessage(
        "Please check your browser has screen capture permissions and try restarting your browser if you continue to have issues."
      );
      onErrorModalOpen();
    }
  }, [screenShareError, onErrorModalOpen]);

  useEffect(() => {
    if (userMediaError === "NotAllowedError") {
      setErrorModalTitle("Can't show your media");
      setErrorModalMessage(
        "Please check your browser has media capture (webcam and microphone) permissions and try restarting your browser if you continue to have issues."
      );
      onErrorModalOpen();
    }
    if (userMediaError === "OverconstrainedError") {
    }

    return () => {
      onErrorModalClose();
    };
  }, [userMediaError, onErrorModalOpen, onErrorModalClose]);

  const toggleScreenshareToast = useCallback(() => {
    if (
      !toast.isActive(ToastIds.VIEWING_SHARED_SCREEN_TOAST_ID) &&
      participantScreenSharing
    ) {
      if (isLocalScreenShare) {
        screenShareToastIdRef.current = toast({
          ...sharingScreenToastConfig,
          render: ({ onClose }) => {
            return (
              <Box
                background="#FCEAF0"
                border="1px solid #DF2868"
                borderRadius="3px"
                color="#666666"
                fontSize="14px"
                padding="15px 20px"
                textAlign="center"
              >
                You are sharing your screen.
                <Box
                  as="button"
                  color="#DF2868"
                  onClick={() => {
                    toggleScreenShare();
                    onClose();
                  }}
                  paddingLeft="10px"
                >
                  Stop Sharing
                </Box>
              </Box>
            );
          },
        });
      } else {
        screenShareToastIdRef.current = toast({
          ...viewingSharedScreenToastId,
          render: () => {
            return (
              <Box
                background="#FCEAF0"
                border="1px solid #DF2868"
                borderRadius="3px"
                color="#666666"
                fontSize="14px"
                padding="15px 20px"
                textAlign="center"
              >
                {participantScreenSharing.id.split("|")[0]} is sharing their
                screen.
              </Box>
            );
          },
        });
      }
    } else {
      if (screenShareToastIdRef.current) {
        toast.close(screenShareToastIdRef.current);
      }
    }
  }, [toast, participantScreenSharing, isLocalScreenShare, toggleScreenShare]);

  useEffect(() => {
    if (screenShareTrack) {
      toggleScreenshareToast();
    } else {
      toggleScreenshareToast();
    }
  }, [screenShareTrack, toggleScreenshareToast]);

  const toggleBroadcastToast = useCallback(
    (isBroadcasting: boolean) => {
      if (
        !toast.isActive(ToastIds.BROADCASTING_SCREEN_TOAST_ID) &&
        isBroadcasting
      ) {
        broadcastingToastIdRef.current = toast({
          ...broadcastingToastId,
          render: () => {
            return (
              <Box
                background="#FCEAF0"
                border="1px solid #DF2868"
                borderRadius="3px"
                color="#666666"
                fontSize="14px"
                padding="15px 20px"
                textAlign="center"
              >
                {"⦿ Space is currently being broadcast"}
              </Box>
            );
          },
        });
      } else {
        if (broadcastingToastIdRef.current) {
          toast.close(broadcastingToastIdRef.current);
        }
      }
    },
    [toast]
  );

  useEffect(() => {
    const handleBroadcastStateChange = (broadcastState: boolean) => {
      toggleBroadcastToast(broadcastState);
    };

    toggleBroadcastToast(space?.broadcasting || false);

    space?.on(SpaceEvent.BroadcastStateChanged, handleBroadcastStateChange);

    return () => {
      space?.off(SpaceEvent.BroadcastStateChanged, handleBroadcastStateChange);
    };
  }, [space, toggleBroadcastToast]);

  const onLeave = useCallback(() => {
    if (broadcastingToastIdRef.current) {
      toast.close(broadcastingToastIdRef.current);
    }
    if (screenShareToastIdRef.current) {
      toast.close(screenShareToastIdRef.current);
    }
  }, [toast]);

  return (
    <>
      <Flex
        height="100%"
        overflow="hidden"
        direction="column"
        backgroundColor="#111"
        backgroundImage="url('/starfield-bg.jpg')"
      >
        {!space ? (
          <Center height="100%">
            <Spinner color="#fb2491" size="xl" />
          </Center>
        ) : screenShareTrack ? (
          <ScreenShareLayout />
        ) : (
          <Gallery />
        )}
        <Controls onLeave={onLeave} />
        <SpaceMan bottom="70px" />
      </Flex>

      <ErrorModal
        title={errorModalTitle}
        message={errorModalMessage}
        isOpen={isErrorModalOpen}
        onClose={onErrorModalClose}
      />
    </>
  );
}
