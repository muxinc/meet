import { useContext } from "react";
import { AcrScore } from "@mux/spaces-web";

import SpaceContext from "../context/Space";

interface Space {
  joinSpace: (
    jwt: string,
    endsAt?: number,
    displayName?: string
  ) => Promise<void>;
  joinError: string | null;
  isJoined: boolean;

  connectionIds: string[];
  localParticipantConnectionId?: string;
  isBroadcasting: boolean;
  participantCount: number;
  publishCamera: (deviceId: string) => void;
  publishMicrophone: (deviceId: string) => void;
  unPublishDevice: (deviceId: string) => void;

  isLocalScreenShareSupported: boolean;
  isScreenShareActive: boolean;
  isLocalScreenShare: boolean;
  screenShareError: string | null;
  attachScreenShare: (element: HTMLVideoElement) => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
  screenShareParticipantConnectionId?: string;
  screenShareParticipantName?: string;

  spaceEndsAt: number | null;
  leaveSpace: () => void;
  submitAcrScore: (score: AcrScore) => Promise<void> | undefined;
}

export const useSpace = (): Space => {
  const {
    space,

    joinSpace,
    joinError,
    isJoined,

    connectionIds,
    isBroadcasting,
    participantCount,
    publishCamera,
    publishMicrophone,
    unPublishDevice,

    isLocalScreenShareSupported,
    isScreenShareActive,
    isLocalScreenShare,
    screenShareError,
    attachScreenShare,
    startScreenShare,
    stopScreenShare,
    screenShareParticipantConnectionId,
    screenShareParticipantName,

    spaceEndsAt,
    leaveSpace,
    submitAcrScore,
  } = useContext(SpaceContext);

  return {
    joinSpace,
    joinError,
    isJoined,

    connectionIds,
    localParticipantConnectionId: space?.localParticipant?.connectionId,
    isBroadcasting,
    participantCount,
    publishCamera,
    publishMicrophone,
    unPublishDevice,

    isLocalScreenShareSupported,
    isScreenShareActive,
    isLocalScreenShare,
    screenShareError,
    attachScreenShare,
    startScreenShare,
    stopScreenShare,
    screenShareParticipantConnectionId,
    screenShareParticipantName,

    spaceEndsAt,
    leaveSpace,
    submitAcrScore,
  };
};
