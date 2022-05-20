import Split from "react-split";
import { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Track } from "@mux/spaces";

import { useParticipants } from "hooks/useParticipants";
import { useLocalParticipant } from "hooks/useLocalParticipant";
import ScreenShareRenderer from "./renderers/ScreenShareRenderer";
import MinimalParticipant from "./MinimalParticipant";

interface Props {
  screenShareTrack: Track;
}

export default function ScreenShareLayout({
  screenShareTrack,
}: Props): JSX.Element {
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const [sortedParticipants, setSortedParticipants] = useState(
    participants || []
  );
  const [pinnedConnectionId, setPinnedConnectionId] = useState("");

  useEffect(() => {
    if (!participants) return;

    // Sort the pinned participant to the top
    const sorted = [...participants].sort((a, b) => {
      if (a.connectionId === pinnedConnectionId) {
        return -1;
      } else if (b.connectionId === pinnedConnectionId) {
        return 1;
      } else {
        return 0;
      }
    });
    setSortedParticipants(sorted);
  }, [participants, pinnedConnectionId]);

  return (
    <>
      <Split
        className="split"
        sizes={[85, 15]}
        style={{ paddingBottom: "80px", zIndex: 100 }}
      >
        <Flex
          alignItems="center"
          height="100%"
          justifyContent="center"
          paddingTop="60px"
        >
          <ScreenShareRenderer track={screenShareTrack} />
        </Flex>

        <Flex direction="column" overflowY="scroll">
          {localParticipant && (
            <MinimalParticipant
              local={true}
              participant={localParticipant}
            />
          )}
          {sortedParticipants.map((participant) => {
            return (
              <MinimalParticipant
                key={participant.connectionId}
                pinnedConnectionId={pinnedConnectionId}
                setPinnedConnectionId={setPinnedConnectionId}
                participant={participant}
              />
            );
          })}
        </Flex>
      </Split>
    </>
  );
}
