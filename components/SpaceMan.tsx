import React from "react";
import Image from "next/image";
import { Box } from "@chakra-ui/react";

interface Props {
  bottom: string;
}

export default function SpaceMan({ bottom }: Props): JSX.Element {
  return (
    <Box
      display={{ base: "none", sm: "flex" }}
      position="absolute"
      bottom={bottom}
      right="10px"
      zIndex={1}
    >
      <Image alt="logo" width="175px" height="200px" src="/mux-in-space.png" />
    </Box>
  );
}
