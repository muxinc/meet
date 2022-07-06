import Split from "react-split";

import { useMemo, useState } from "react";
import { LocalParticipant } from "@mux/spaces-web";
import { Flex, Grid } from "@chakra-ui/react";

import { useParticipants } from "hooks/useParticipants";
import { useLocalParticipant } from "hooks/useLocalParticipant";
import ScreenShareRenderer from "./renderers/ScreenShareRenderer";
import MinimalParticipant from "./MinimalParticipant";
import OtherParticipantsPill from "./OtherParticipantPill";
import ParticipantAudio from "./ParticipantAudio";

export default function ScreenShareLayout(): JSX.Element {
  const MAX_MINIMAL_PARTICIPANTS = 10;

  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const [pinnedConnectionId, setPinnedConnectionId] = useState("");

  const sortedParticipants = useMemo(() => {
    if (participants) {
      return [...participants].sort((a, b) => {
        if (a.connectionId === pinnedConnectionId) {
          return -1;
        } else if (b.connectionId === pinnedConnectionId) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      return [];
    }
  }, [participants, pinnedConnectionId]);

  const allParticipants = localParticipant
    ? [localParticipant, ...sortedParticipants]
    : sortedParticipants;
  const columnCount =
    allParticipants.length > MAX_MINIMAL_PARTICIPANTS / 2 ? 2 : 1;

  return (
    <Split
      className="split"
      sizes={[80, 20]}
      style={{
        paddingBottom: "80px",
        zIndex: 100,
      }}
    >
      <Flex
        alignItems="center"
        height="100%"
        justifyContent="center"
        paddingTop="60px"
      >
        <ScreenShareRenderer />
      </Flex>
      <Flex
        alignItems="center"
        height="100%"
        padding="20px"
        position="relative"
        width="100%"
      >
        {participants?.map((participant) => (
          <ParticipantAudio
            key={participant.connectionId}
            participant={participant}
          />
        ))}
        <Grid
          height="100%"
          width="100%"
          alignItems="center"
          alignContent="center"
          gridGap="20px"
          gridTemplateColumns={`${
            columnCount == 2 ? "repeat(2, 1fr)" : "repeat(1, 1fr)"
          }`}
          gridTemplateRows="auto"
        >
          {allParticipants
            .slice(0, MAX_MINIMAL_PARTICIPANTS)
            .map((participant, index) => {
              const isLocal = participant instanceof LocalParticipant;
              return (
                <MinimalParticipant
                  key={participant.connectionId}
                  local={isLocal}
                  pinnedConnectionId={pinnedConnectionId}
                  setPinnedConnectionId={setPinnedConnectionId}
                  participant={participant}
                />
              );
            })}
        </Grid>
        {allParticipants.length > MAX_MINIMAL_PARTICIPANTS && (
          <OtherParticipantsPill
            participants={allParticipants.slice(MAX_MINIMAL_PARTICIPANTS)}
            onSelect={(participant) => {
              if (setPinnedConnectionId) {
                if (pinnedConnectionId === participant.connectionId) {
                  setPinnedConnectionId("");
                } else {
                  setPinnedConnectionId(participant.connectionId);
                }
              }
            }}
          />
        )}
      </Flex>
    </Split>
  );
}
