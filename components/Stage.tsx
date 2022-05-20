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

import {
  CreateLocalMediaOptions,
  LocalTrack,
  RemoteParticipant,
  RemoteTrack,
  SpaceEvent,
  Track,
  TrackKind,
  TrackSource,
} from "@mux/spaces";

import { useSpace } from "hooks/useSpace";
import { useLocalParticipant } from "hooks/useLocalParticipant";
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
import { useLocalStorage } from "hooks/useLocalStorage";

export default function Stage(): JSX.Element {
  const toast = useToast();
  const space = useSpace();
  const screenShareToastIdRef = useRef<ToastId | undefined>();
  const broadcastingToastIdRef = useRef<ToastId | undefined>();
  const localParticipant = useLocalParticipant();
  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onErrorModalClose,
  } = useDisclosure();
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [screenShareTrack, setScreenShareTrack] = useState<Track | null>(null);
  const [isLocalScreenShare, setIsLocalScreenShare] = useState(false);
  const [tracksPublished, setTracksPublished] = useState(false);
  const [audioDeviceId, setAudioDeviceId] = useLocalStorage(
    "audioDeviceId",
    ""
  );
  const [videoDeviceId, setVideoDeviceId] = useLocalStorage(
    "videoDeviceId",
    ""
  );
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    async function publishTracks() {
      if (!localParticipant) {
        return;
      }

      // If a previously selected audio/video device is saved, we'll try to use that.
      // If it's no longer available, we'll fall back to browser defaults.
      const storedAudioDeviceId = audioDeviceId;
      const storedVideoDeviceId = videoDeviceId;

      let options: CreateLocalMediaOptions = { video: {}, audio: {} };
      if (storedAudioDeviceId) {
        options.audio = {
          constraints: {
            deviceId: { exact: storedAudioDeviceId },
          },
        };
      }
      if (storedVideoDeviceId) {
        options.video = {
          constraints: {
            deviceId: { exact: storedVideoDeviceId },
          },
        };
      }

      let tracks: LocalTrack[] | undefined = undefined;
      try {
        tracks = await localParticipant.getUserMedia(options);
        setHasPermissions(true);
      } catch (e) {
        // May occur if previously set device IDs are no longer available
        if (e instanceof DOMException) {
          // permission denied to camera
          setErrorModalTitle("Can't open Audio or Video!");
          setErrorModalMessage(
            "Please check that you have given your browser audio and video permission."
          );
          onErrorModalOpen();
          setHasPermissions(false);
        } else if (e instanceof OverconstrainedError) {
          options = { video: {}, audio: {} };
          tracks = await localParticipant.getUserMedia(options);
          setHasPermissions(true);
        } else {
          console.error(e);
          setHasPermissions(false);
        }
      }
      if (tracks) {
        localParticipant.publishTracks(tracks);

        tracks.forEach((track) => {
          switch (track.kind) {
            case TrackKind.Audio:
              localStorage.setItem("audioDeviceId", track.deviceId ?? "");
              break;
            case TrackKind.Video:
              localStorage.setItem("videoDeviceId", track.deviceId ?? "");
              break;
          }
        });
        setTracksPublished(true);
      }
    }
    publishTracks();
  }, [localParticipant, onErrorModalOpen, audioDeviceId, videoDeviceId]);

  // Screenshare subscribed
  useEffect(() => {
    const handleScreenShareSubscribed = (
      participant: RemoteParticipant,
      track: RemoteTrack
    ) => {
      if (track.source === TrackSource.Screenshare) {
        setScreenShareTrack(track);

        if (!toast.isActive(ToastIds.VIEWING_SHARED_SCREEN_TOAST_ID)) {
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
                  {participant.id} is sharing their screen.
                </Box>
              );
            },
          });
        }
      }
    };

    space?.on(
      SpaceEvent.ParticipantTrackSubscribed,
      handleScreenShareSubscribed
    );

    return () => {
      space?.off(
        SpaceEvent.ParticipantTrackSubscribed,
        handleScreenShareSubscribed
      );
    };
  }, [space, toast]);

  // Screenshare unsubscribed
  useEffect(() => {
    const handleScreenShareUnsubscribed = (
      _participant: RemoteParticipant,
      track: RemoteTrack
    ) => {
      if (track.source === TrackSource.Screenshare) {
        setScreenShareTrack(null);
        if (screenShareToastIdRef.current) {
          toast.close(screenShareToastIdRef.current);
        }
      }
    };

    space?.on(
      SpaceEvent.ParticipantTrackUnpublished,
      handleScreenShareUnsubscribed
    );

    return () => {
      space?.off(
        SpaceEvent.ParticipantTrackSubscribed,
        handleScreenShareUnsubscribed
      );
    };
  }, [space, toast]);

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

  // Screenshare toggled
  const toggleScreenShare = useCallback(async () => {
    if (screenShareTrack) {
      // Shouldn't happen, but just to prevent a bug being added later
      if (!isLocalScreenShare || !(screenShareTrack instanceof LocalTrack)) {
        console.error(
          "Invalid state. Screen share toggled while someone else is sharing."
        );
        return;
      }

      // Stop screen share
      localParticipant?.unpublishTracks([screenShareTrack]);
      screenShareTrack.track?.stop();
      setScreenShareTrack(null);
      setIsLocalScreenShare(false);
      if (screenShareToastIdRef.current) {
        toast.close(screenShareToastIdRef.current);
      }
    } else {
      // Start screen share
      try {
        const screenStream = await localParticipant?.getDisplayMedia({
          video: {},
        });
        if (screenStream) {
          localParticipant?.publishTracks(screenStream);
          screenStream[0].track.onended = function () {
            localParticipant?.unpublishTracks(screenStream);
            setScreenShareTrack(null);
            setIsLocalScreenShare(false);
            if (screenShareToastIdRef.current) {
              toast.close(screenShareToastIdRef.current);
            }
          };
          setScreenShareTrack(screenStream[0]);
          setIsLocalScreenShare(true);

          if (!toast.isActive(ToastIds.SHARING_SCREEN_TOAST_ID)) {
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
                        localParticipant?.unpublishTracks(screenStream);
                        screenStream[0].track.stop();
                        setScreenShareTrack(null);
                        setIsLocalScreenShare(false);
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
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Permission denied") {
            // do nothing, they pressed cancel
          } else if (error.message === "Permission denied by system") {
            // chrome does not have permission to screen share
            setErrorModalTitle("Can't share your screen");
            setErrorModalMessage(
              "Please check your browser has screen capture permissions and try restarting your browser if you continue to have issues."
            );
            onErrorModalOpen();
          } else {
            // unhandled exception
            console.error(error);
          }
        }
      }
    }
  }, [
    screenShareTrack,
    isLocalScreenShare,
    localParticipant,
    toast,
    onErrorModalOpen,
  ]);

  return (
    <>
      <Flex
        direction="column"
        height="100%"
        backgroundColor="#111"
        backgroundImage="url('/starfield-bg.jpg')"
        overflow="hidden"
      >
        {!space || !tracksPublished ? (
          <Center height="100%">
            <Spinner colorScheme="purple" size="xl" />
          </Center>
        ) : (
          <>
            {screenShareTrack ? (
              <ScreenShareLayout screenShareTrack={screenShareTrack} />
            ) : (
              <Gallery />
            )}
          </>
        )}
        <Controls
          isLocalScreenShare={isLocalScreenShare}
          screenIsShared={screenShareTrack !== null}
          toggleScreenShare={toggleScreenShare}
          hasPermissions={hasPermissions}
        />
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
