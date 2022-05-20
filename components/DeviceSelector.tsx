import { useCallback, useEffect, useState } from "react";
import { Select, FormControl, FormLabel } from "@chakra-ui/react";
import {
  CreateLocalMediaOptions,
  LocalTrackOptions,
  TrackKind,
} from "@mux/spaces";
import { useLocalParticipant } from "hooks/useLocalParticipant";
import { useLocalStorage } from "hooks/useLocalStorage";

export default function DeviceSelector(): JSX.Element {
  const localParticipant = useLocalParticipant();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDeviceId, setAudioDeviceId] = useLocalStorage(
    "audioDeviceId",
    ""
  );
  const [videoDeviceId, setVideoDeviceId] = useLocalStorage(
    "videoDeviceId",
    ""
  );

  useEffect(() => {
    async function loadDevices() {
      const availableDevices = await navigator.mediaDevices.enumerateDevices();

      const storedAudioDeviceId = audioDeviceId;
      if (storedAudioDeviceId) {
        const availableAudioDeviceId = availableDevices.find(
          (availableDevice) => {
            return (
              availableDevice.kind === "audioinput" &&
              availableDevice.deviceId === storedAudioDeviceId
            );
          }
        );
        if (availableAudioDeviceId) {
          setAudioDeviceId(availableAudioDeviceId.deviceId);
        }
      }

      const storedVideoDeviceId = videoDeviceId;
      if (storedVideoDeviceId) {
        const availableVideoDeviceId = availableDevices.find(
          (availableDevice) => {
            return (
              availableDevice.kind === "videoinput" &&
              availableDevice.deviceId === storedVideoDeviceId
            );
          }
        );
        if (availableVideoDeviceId) {
          setVideoDeviceId(availableVideoDeviceId.deviceId);
        }
      }

      setDevices(availableDevices);
    }
    loadDevices();
  }, [audioDeviceId, setAudioDeviceId, setVideoDeviceId, videoDeviceId]);

  const handleDeviceChange = useCallback(
    (trackKind: TrackKind, newDeviceId: string) => {
      let options: CreateLocalMediaOptions = {};
      if (newDeviceId !== "") {
        const option: LocalTrackOptions = {
          constraints: {
            deviceId: { exact: newDeviceId },
          },
        };
        switch (trackKind) {
          case TrackKind.Audio:
            options["audio"] = option;
            break;
          case TrackKind.Video:
            options["video"] = option;
            break;
        }
      }

      localParticipant?.getUserMedia(options).then((tracks) => {
        const updatedTracks = localParticipant.updateTracks(tracks);
        updatedTracks.forEach((track) => {
          switch (track.kind) {
            case TrackKind.Audio:
              setAudioDeviceId(newDeviceId);
              break;
            case TrackKind.Video:
              setVideoDeviceId(newDeviceId);
              break;
          }
        });
      });
    },
    [localParticipant, setAudioDeviceId, setVideoDeviceId]
  );

  return (
    <form>
      <FormControl>
        <FormLabel htmlFor="camera">Select a camera</FormLabel>
        <Select
          id="camera"
          value={videoDeviceId}
          onChange={(event) =>
            handleDeviceChange(TrackKind.Video, event.target.value)
          }
        >
          {devices
            .filter((d) => d.kind === "videoinput")
            .map((device) => {
              return (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              );
            })}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="microphone">Select a microphone</FormLabel>
        <Select
          id="microphone"
          value={audioDeviceId}
          onChange={(event) =>
            handleDeviceChange(TrackKind.Audio, event.target.value)
          }
        >
          {devices
            .filter((d) => d.kind === "audioinput")
            .map((device) => {
              return (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              );
            })}
        </Select>
      </FormControl>
    </form>
  );
}
