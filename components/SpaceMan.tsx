import React from "react";
import Image from "next/image";
import { Box } from "@chakra-ui/react";

interface Props {
  bottom?: string;
}

export default function SpaceMan({ bottom = "0px" }: Props): JSX.Element {
  return (
    <Box
      display={{ base: "none", sm: "flex" }}
      position="absolute"
      bottom={bottom}
      right="10px"
      zIndex={0}
    >
      <Image
        priority
        alt="logo"
        width={175}
        height={200}
        src="/mux-in-space.png"
      />
    </Box>
  );
}
