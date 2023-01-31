import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AcrScore,
  ActiveSpeaker,
  getDisplayMedia,
  LocalParticipant,
  LocalTrack,
  RemoteParticipant,
  Space,
  SpaceEvent,
  Track,
  TrackSource,
} from "@mux/spaces-web";

import { MAX_PARTICIPANTS_PER_PAGE } from "lib/constants";

import UserContext from "./User";
import UserMediaContext from "./UserMedia";

interface SpaceState {
  space: Space | null;
  localParticipant: LocalParticipant | null;
  remoteParticipants: RemoteParticipant[];

  joinSpace: (jwt: string, endsAt?: number) => Promise<void>;
  joinError: string | null;
  isJoined: boolean;

  connectionIds: string[];
  isBroadcasting: boolean;
  participantCount: number;
  onSpaceEvent: (event: SpaceEvent, callback: (...args: any) => void) => void;
  publishCamera: (deviceId: string) => void;
  publishMicrophone: (deviceId: string) => void;
  unPublishDevice: (deviceId: string) => void;

  isScreenShareActive: boolean;
  isLocalScreenShare: boolean;
  screenShareError: string | null;
  attachScreenShare: (element: HTMLVideoElement) => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
  screenShareParticipantId?: string;

  spaceEndsAt: number | null;
  leaveSpace: () => void;
  submitAcrScore: (score: AcrScore) => Promise<void> | undefined;
}

export const SpaceContext = createContext({} as SpaceState);

export default SpaceContext;

type Props = {
  children: ReactNode;
};

export const SpaceProvider: React.FC<Props> = ({ children }) => {
  const { microphoneMuted, microphoneDeviceId, cameraOff, cameraDeviceId } =
    useContext(UserContext);
  const { getMicrophone, getCamera } = useContext(UserMediaContext);

  const [space, setSpace] = useState<Space | null>(null);
  const [spaceEndsAt, setSpaceEndsAt] = useState<number | null>(null);
  const [localParticipant, setLocalParticipant] =
    useState<LocalParticipant | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);
  const [isJoined, setIsJoined] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [screenShareTrack, setScreenShareTrack] = useState<Track>();
  const [screenShareError, setScreenShareError] = useState<string | null>(null);
  const [participantScreenSharing, setParticipantScreenSharing] = useState<
    LocalParticipant | RemoteParticipant | null
  >(null);

  const screenShareParticipantId = useMemo(() => {
    return participantScreenSharing?.id;
  }, [participantScreenSharing]);

  const isScreenShareActive = useMemo(() => {
    return !!screenShareTrack;
  }, [screenShareTrack]);

  const isLocalScreenShare = useMemo(() => {
    return participantScreenSharing instanceof LocalParticipant;
  }, [participantScreenSharing]);

  const participantCount = useMemo(() => {
    return (localParticipant ? 1 : 0) + remoteParticipants.length;
  }, [localParticipant, remoteParticipants]);

  const connectionIds = useMemo(() => {
    return (localParticipant ? [localParticipant.connectionId] : []).concat(
      remoteParticipants.map((p) => p.connectionId)
    );
  }, [localParticipant, remoteParticipants]);

  const publishForLocalParticipant = useCallback(
    async (localParticipant: LocalParticipant) => {
      const tracksToPublish = [];
      if (cameraDeviceId && !cameraOff) {
        const cameraTrack = await getCamera(cameraDeviceId);
        tracksToPublish.push(cameraTrack);
      }
      if (microphoneDeviceId) {
        const microphoneTrack = await getMicrophone(microphoneDeviceId);
        tracksToPublish.push(microphoneTrack);
      }
      if (tracksToPublish.length > 0) {
        const publishedTracks = await localParticipant.publishTracks(
          tracksToPublish
        );
        const publishedMicrophone = publishedTracks.find(
          (track) => track.source === TrackSource.Microphone
        );
        if (publishedMicrophone && microphoneMuted) {
          publishedMicrophone.mute();
        }
      }
    },
    [
      cameraOff,
      getMicrophone,
      microphoneDeviceId,
      getCamera,
      cameraDeviceId,
      microphoneMuted,
    ]
  );

  const joinSpace = useCallback(
    async (jwt: string, endsAt?: number) => {
      let _space: Space;
      try {
        _space = new Space(jwt);
      } catch (e: any) {
        setJoinError(e.message);
        return;
      }

      if (endsAt) {
        setSpaceEndsAt(endsAt);
      }

      const handleBroadcastStateChange = (broadcastState: boolean) => {
        setIsBroadcasting(broadcastState);
      };

      const handleParticipantJoined = (newParticipant: RemoteParticipant) => {
        setRemoteParticipants((oldParticipantArray) => {
          const found = oldParticipantArray.find(
            (p) => p.connectionId === newParticipant.connectionId
          );
          if (!found) {
            return [...oldParticipantArray, newParticipant];
          }
          return oldParticipantArray;
        });
      };

      const handleParticipantLeft = (participantLeaving: RemoteParticipant) => {
        setRemoteParticipants((oldParticipantArray) =>
          oldParticipantArray.filter(
            (p) => p.connectionId !== participantLeaving.connectionId
          )
        );
      };

      const handleActiveSpeakerChanged = (
        activeSpeakerChanges: ActiveSpeaker[]
      ) => {
        setRemoteParticipants((oldParticipantArray) => {
          const updatedParticipants = [...oldParticipantArray];

          activeSpeakerChanges.forEach((activeSpeaker: ActiveSpeaker) => {
            if (activeSpeaker.participant instanceof RemoteParticipant) {
              const participantIndex = updatedParticipants.findIndex(
                (p) => p.connectionId === activeSpeaker.participant.connectionId
              );

              if (participantIndex >= MAX_PARTICIPANTS_PER_PAGE - 1) {
                updatedParticipants.splice(participantIndex, 1);
                updatedParticipants.unshift(activeSpeaker.participant);
              }
            }
          });
          return updatedParticipants;
        });
      };

      const setupScreenShare = (
        participant: LocalParticipant | RemoteParticipant,
        track: Track
      ) => {
        setScreenShareTrack(track);
        setParticipantScreenSharing(participant);
      };

      const tearDownScreenShare = () => {
        setScreenShareTrack(undefined);
        setParticipantScreenSharing(null);
      };

      const handleParticipantTrackPublished = (
        participant: LocalParticipant | RemoteParticipant,
        track: Track
      ) => {
        if (track.source === TrackSource.Screenshare && track.hasMedia()) {
          setupScreenShare(participant, track);
        }
      };

      const handleParticipantTrackSubscribed = (
        participant: LocalParticipant | RemoteParticipant,
        track: Track
      ) => {
        if (participant instanceof RemoteParticipant) {
          reorderRemoteParticipantsBySubscription(participant);
        }
        if (track.source === TrackSource.Screenshare && track.hasMedia()) {
          setupScreenShare(participant, track);
        }
      };

      const handleParticipantTrackUnpublished = (
        _participant: LocalParticipant | RemoteParticipant,
        track: Track
      ) => {
        if (track.source === TrackSource.Screenshare) {
          tearDownScreenShare();
        }
      };

      const handleParticipantTrackUnsubscribed = (
        participant: LocalParticipant | RemoteParticipant,
        track: Track
      ) => {
        if (participant instanceof RemoteParticipant) {
          reorderRemoteParticipantsBySubscription(participant);
        }
        if (track.source === TrackSource.Screenshare) {
          tearDownScreenShare();
        }
      };

      const reorderRemoteParticipantsBySubscription = (
        participantWhoChanged: RemoteParticipant
      ) => {
        setRemoteParticipants((oldParticipantArray) => {
          const updatedSubscriptionParticipants = oldParticipantArray.map(
            (oldParticipant) =>
              oldParticipant.connectionId === participantWhoChanged.connectionId
                ? participantWhoChanged
                : oldParticipant
          );

          return [
            ...updatedSubscriptionParticipants.filter((p) => p.isSubscribed()),
            ...updatedSubscriptionParticipants.filter((p) => !p.isSubscribed()),
          ];
        });
      };

      _space.on(SpaceEvent.ParticipantJoined, handleParticipantJoined);
      _space.on(SpaceEvent.ParticipantLeft, handleParticipantLeft);

      _space.on(SpaceEvent.ActiveSpeakersChanged, handleActiveSpeakerChanged);
      _space.on(SpaceEvent.BroadcastStateChanged, handleBroadcastStateChange);

      _space.on(
        SpaceEvent.ParticipantTrackPublished,
        handleParticipantTrackPublished
      );
      _space.on(
        SpaceEvent.ParticipantTrackSubscribed,
        handleParticipantTrackSubscribed
      );
      _space.on(
        SpaceEvent.ParticipantTrackUnpublished,
        handleParticipantTrackUnpublished
      );
      _space.on(
        SpaceEvent.ParticipantTrackUnsubscribed,
        handleParticipantTrackUnsubscribed
      );

      setSpace(_space);

      try {
        const _localParticipant = await _space.join();
        publishForLocalParticipant(_localParticipant);
        setLocalParticipant(_localParticipant);
        setIsBroadcasting(_space.broadcasting);
        setIsJoined(true);
      } catch (error: any) {
        setJoinError(error.message);
        setIsBroadcasting(false);
        setIsJoined(false);
      }
    },
    [publishForLocalParticipant]
  );

  const onSpaceEvent = useCallback(
    (event: SpaceEvent, callback: (...args: any) => void) => {
      try {
        space?.on(event, callback);
      } catch (_error) {
        throw new Error("Join a space before adding event handlers.");
      }
    },
    [space]
  );

  const publishMicrophone = useCallback(
    async (deviceId: string) => {
      if (!localParticipant) {
        throw new Error("Join a space before publishing a device.");
      }
      if (microphoneDeviceId !== deviceId) {
        const microphoneTrack = await getMicrophone(deviceId);
        localParticipant.updateTracks([microphoneTrack]);
      } else {
        const publishedMicrophone = localParticipant
          .getAudioTracks()
          .filter((track) => track.source === TrackSource.Microphone)
          .find((track) => track.deviceId === deviceId);
        if (publishedMicrophone) {
          throw new Error("That microphone is already published.");
        }
        const microphoneTrack = await getMicrophone(deviceId);
        localParticipant.publishTracks([microphoneTrack]);
      }
    },
    [localParticipant, microphoneDeviceId, getMicrophone]
  );

  const publishCamera = useCallback(
    async (deviceId: string) => {
      if (!localParticipant) {
        throw new Error("Join a space before publishing a device.");
      }
      if (cameraDeviceId !== deviceId) {
        const cameraTrack = await getCamera(deviceId);
        localParticipant.updateTracks([cameraTrack]);
      } else {
        const publishedCamera = localParticipant
          .getVideoTracks()
          .filter((track) => track.source === TrackSource.Camera)
          .find((track) => track.deviceId === deviceId);
        if (publishedCamera) {
          throw new Error("That camera is already published.");
        }
        const cameraTrack = await getCamera(deviceId);
        localParticipant.publishTracks([cameraTrack]);
      }
    },
    [localParticipant, cameraDeviceId, getCamera]
  );

  const unPublishDevice = useCallback(
    (deviceId: string): void => {
      if (!localParticipant) {
        throw new Error(
          "Join a space and publish a device before un-publishing the device."
        );
      }
      const publishedDevice = localParticipant
        .getTracks()
        .find((track) => track.deviceId === deviceId);
      if (publishedDevice) {
        localParticipant.unpublishTracks([publishedDevice]);
      } else {
        throw new Error("Device to un-published was not found.");
      }
    },
    [localParticipant]
  );

  const startScreenShare = useCallback(async () => {
    try {
      const screenStreams = await getDisplayMedia({
        video: true,
        audio: false,
      });
      const screenStream = screenStreams?.find(
        (track) => track.source === "screenshare"
      );
      if (screenStream) {
        if (localParticipant) {
          return localParticipant
            .publishTracks([screenStream])
            .then((publishedTracks: LocalTrack[]) => {
              if (publishedTracks.length < 1) {
                throw new Error("Failed to publish track.");
              }
              return publishedTracks[0];
            });
        } else {
          throw new Error("Join a space before starting a screen share.");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Permission denied") {
          // do nothing, they pressed cancel
        } else if (error.message === "Permission denied by system") {
          // chrome does not have permission to screen share
          setScreenShareError(error.message);
        } else {
          // unhandled exception
          console.error(error);
        }
      }
    }
  }, [localParticipant, setScreenShareError]);

  const stopScreenShare = useCallback(async () => {
    if (screenShareTrack && screenShareTrack instanceof LocalTrack) {
      if (localParticipant) {
        localParticipant.unpublishTracks([screenShareTrack]);
      } else {
        throw new Error("Join a space before stopping the screen share.");
      }
    } else {
      throw new Error("No screen share to stop.");
    }
  }, [localParticipant, screenShareTrack]);

  const attachScreenShare = useCallback(
    (element: HTMLVideoElement) => {
      screenShareTrack?.attachedElements.forEach((attachedEl) =>
        screenShareTrack.detach(attachedEl)
      );
      screenShareTrack?.attach(element);
    },
    [screenShareTrack]
  );

  const submitAcrScore = useCallback(
    (score: AcrScore) => {
      try {
        return space?.submitAcrScore(score);
      } catch (error) {
        throw new Error(
          "You must join a space before submitting an ACR score."
        );
      }
    },
    [space]
  );

  const leaveSpace = useCallback(() => {
    try {
      space?.removeAllListeners();
      space?.leave();
    } finally {
      setJoinError(null);
      setRemoteParticipants([]);
      setIsBroadcasting(false);
      setLocalParticipant(null);
      setIsJoined(false);
      setSpace(null);
      setSpaceEndsAt(null);
    }
  }, [space]);

  return (
    <SpaceContext.Provider
      value={{
        space,
        localParticipant,
        remoteParticipants,

        joinSpace,
        joinError,
        isJoined,

        connectionIds,
        isBroadcasting,
        participantCount,
        onSpaceEvent,
        publishCamera,
        publishMicrophone,
        unPublishDevice,

        isScreenShareActive,
        isLocalScreenShare,
        screenShareError,
        attachScreenShare,
        startScreenShare,
        stopScreenShare,
        screenShareParticipantId,

        leaveSpace,
        submitAcrScore,
        spaceEndsAt,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};
