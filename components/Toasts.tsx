import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import { Box, ToastId, useToast } from "@chakra-ui/react";
import {
  RemoteParticipant,
  RemoteTrack,
  SpaceEvent,
  LocalParticipant,
  LocalTrack,
  TrackSource,
} from "@mux/spaces-web";

import { useSpace } from "hooks/useSpace";
import { useLocalParticipant } from "hooks/useLocalParticipant";

import {
  broadcastingToastConfig,
  participantEventToastConfig,
  sharingScreenToastConfig,
  ToastIds,
  viewingSharedScreenToastConfig,
} from "shared/toastConfigs";

const ToastBox = styled(Box)`
  color: #666666;
  background: #fceaf0;
  border: 1px solid #df2868;
  border-radius: 3px;
  font-size: 14px;
  padding: 15px 20px;
  text-align: center;
`;

export default function Toasts(): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const { space } = useSpace();
  const { isReady: isRouterReady } = router;
  const localParticipant = useLocalParticipant();
  const screenshareToastRef = useRef<ToastId>();
  const broadcastingToastRef = useRef<ToastId>();
  const participantEventToastIdRefs = useRef<Array<ToastId>>([]);

  const showLocalScreenshareToast = useCallback(
    (screenshareTrack: LocalTrack) => {
      if (!toast.isActive(ToastIds.SHARING_SCREEN_TOAST_ID)) {
        screenshareToastRef.current = toast({
          ...sharingScreenToastConfig,
          render: ({ onClose }) => {
            return (
              <ToastBox>
                You are sharing your screen.
                <Box
                  as="button"
                  color="#DF2868"
                  onClick={() => {
                    localParticipant?.unpublishTracks([screenshareTrack]);
                    onClose();
                  }}
                  paddingLeft="10px"
                >
                  Stop Sharing
                </Box>
              </ToastBox>
            );
          },
        });
      }
    },
    [toast, localParticipant]
  );

  const showRemoteScreenshareToast = useCallback(
    (participantName: string) => {
      if (!toast.isActive(ToastIds.VIEWING_SHARED_SCREEN_TOAST_ID)) {
        screenshareToastRef.current = toast({
          ...viewingSharedScreenToastConfig,
          render: () => (
            <ToastBox>{participantName} is sharing their screen.</ToastBox>
          ),
        });
      }
    },
    [toast]
  );

  const hideScreenshareToast = useCallback(() => {
    if (screenshareToastRef.current) {
      toast.close(screenshareToastRef.current);
    }
  }, [toast]);

  const showBroadcastToast = useCallback(() => {
    if (!toast.isActive(ToastIds.BROADCASTING_SCREEN_TOAST_ID)) {
      broadcastingToastRef.current = toast({
        ...broadcastingToastConfig,
        render: () => (
          <ToastBox>{"⦿ Space is currently being broadcast"}</ToastBox>
        ),
      });
    }
  }, [toast]);

  const hideBroadcastToast = useCallback(() => {
    if (broadcastingToastRef.current) {
      toast.close(broadcastingToastRef.current);
    }
  }, [toast]);

  const showParticipantEventToast = useCallback(
    (eventDescription: string) => {
      participantEventToastIdRefs.current.push(
        toast({
          ...participantEventToastConfig,
          render: () => <ToastBox>{eventDescription}</ToastBox>,
        })
      );
    },
    [toast]
  );

  useEffect(() => {
    if (!space) return;

    const handleBroadcastStateChange = (isBroadcasting: boolean) => {
      if (isBroadcasting) {
        showBroadcastToast();
      } else {
        hideBroadcastToast();
      }
    };

    const handleParticipantJoined = (participant: RemoteParticipant) => {
      let participantName = participant.id.split("|")[0];
      showParticipantEventToast(`${participantName} joined the space`);
    };

    const handleParticipantLeft = (participant: RemoteParticipant) => {
      let participantName = participant.id.split("|")[0];
      showParticipantEventToast(`${participantName} left the space`);
    };

    const handleParticipantTrackPublished = (
      participant: LocalParticipant | RemoteParticipant,
      track: LocalTrack | RemoteTrack
    ) => {
      if (track.source === TrackSource.Screenshare) {
        if (
          participant instanceof LocalParticipant &&
          track instanceof LocalTrack
        ) {
          showLocalScreenshareToast(track);
        } else {
          let participantName = participant.id.split("|")[0];
          showRemoteScreenshareToast(participantName);
        }
      }
    };

    const handleParticipantTrackUnpublished = (
      _participant: LocalParticipant | RemoteParticipant,
      track: LocalTrack | RemoteTrack
    ) => {
      if (track.source === TrackSource.Screenshare) {
        hideScreenshareToast();
      }
    };

    const handleParticipantTrackSubscribed = (
      participant: RemoteParticipant,
      track: RemoteTrack
    ) => {
      if (track.source === TrackSource.Screenshare) {
        if (participant instanceof RemoteParticipant) {
          let participantName = participant.id.split("|")[0];
          showRemoteScreenshareToast(participantName);
        }
      }
    };

    const handleParticipantTrackUnsubscribed = (
      _participant: RemoteParticipant,
      track: RemoteTrack
    ) => {
      if (track.source === TrackSource.Screenshare) {
        hideScreenshareToast();
      }
    };

    space.on(SpaceEvent.BroadcastStateChanged, handleBroadcastStateChange);
    space.on(SpaceEvent.ParticipantJoined, handleParticipantJoined);
    space.on(SpaceEvent.ParticipantLeft, handleParticipantLeft);

    space.on(
      SpaceEvent.ParticipantTrackPublished,
      handleParticipantTrackPublished
    );
    space.on(
      SpaceEvent.ParticipantTrackUnpublished,
      handleParticipantTrackUnpublished
    );
    space.on(
      SpaceEvent.ParticipantTrackSubscribed,
      handleParticipantTrackSubscribed
    );
    space.on(
      SpaceEvent.ParticipantTrackUnsubscribed,
      handleParticipantTrackUnsubscribed
    );

    return () => {
      space.off(SpaceEvent.BroadcastStateChanged, handleBroadcastStateChange);
      space.off(SpaceEvent.ParticipantJoined, handleParticipantJoined);
      space.off(SpaceEvent.ParticipantLeft, handleParticipantLeft);

      space.off(
        SpaceEvent.ParticipantTrackPublished,
        handleParticipantTrackPublished
      );
      space.off(
        SpaceEvent.ParticipantTrackUnpublished,
        handleParticipantTrackUnpublished
      );
      space.off(
        SpaceEvent.ParticipantTrackSubscribed,
        handleParticipantTrackSubscribed
      );
      space.off(
        SpaceEvent.ParticipantTrackUnsubscribed,
        handleParticipantTrackUnsubscribed
      );
    };
  }, [
    space,
    showBroadcastToast,
    hideBroadcastToast,
    showLocalScreenshareToast,
    showRemoteScreenshareToast,
    hideScreenshareToast,
    showParticipantEventToast,
  ]);

  useEffect(() => {
    if (!isRouterReady) return;

    function closeAllTosts() {
      hideBroadcastToast();
      hideScreenshareToast();
      for (let toastRef in participantEventToastIdRefs.current) {
        toast.close(toastRef);
      }
    }

    router.events.on("routeChangeStart", closeAllTosts);
    return () => {
      router.events.off("routeChangeStart", closeAllTosts);
    };
  }, [isRouterReady, router, toast, hideBroadcastToast, hideScreenshareToast]);

  return <></>;
}
