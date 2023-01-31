import React from "react";
import Image from "next/image";
import { Flex } from "@chakra-ui/react";

import muxLogo from "../../public/mux-logo.svg";

export default function ControlsLeft(): JSX.Element {
  return (
    <Flex
      alignItems="center"
      display={{ base: "none", md: "flex" }}
      width="290px"
    >
      <a
        href="https://www.mux.com/real-time-video"
        target="_blank"
        rel="noreferrer"
      >
        <Image priority alt="logo" width={150} height={35} src={muxLogo} />
      </a>
    </Flex>
  );
}
