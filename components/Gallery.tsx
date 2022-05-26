import React from "react";
import { Box, Grid } from "@chakra-ui/react";

import LocalView from "./LocalView";
import Participant from "./Participant";
import { useParticipants } from "hooks/useParticipants";

const calculateRows = (n: number) => Math.round(Math.sqrt(n));
const calculateCols = (n: number) => Math.ceil(Math.sqrt(n));

export default function Gallery(): JSX.Element {
  const participants = useParticipants();
  const numParticipants = 1 + (participants?.length || 0);
  const numCols = calculateCols(numParticipants);
  const numRows = calculateRows(numParticipants);

  return (
    <Box
      width="100%"
      height="100%"
      marginInline="auto"
      display="flex"
      justifyContent="center"
      paddingBottom="80px" /* Height of control bar */
      alignItems="center"
      zIndex={100}
    >
      <Grid
        width="100%"
        maxHeight="100%"
        templateColumns={`repeat(${numCols}, 1fr)`}
        templateRows={`repeat(${numRows}, 1fr)`}
        gridGap="2"
        padding="20px"
      >
        <LocalView />
        {participants?.map((participant) => {
          return (
            <Participant
              key={participant.id}
              local={false}
              participant={participant}
            />
          );
        })}
      </Grid>
    </Box>
  );
}
