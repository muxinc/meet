import { useContext } from "react";
import { AcrScore, SpaceEvent } from "@mux/spaces-web";

import SpaceContext from "../context/Space";

interface Space {
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

export const useSpace = (): Space => {
  const {
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

    spaceEndsAt,
    leaveSpace,
    submitAcrScore,
  } = useContext(SpaceContext);

  return {
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

    spaceEndsAt,
    leaveSpace,
    submitAcrScore,
  };
};
