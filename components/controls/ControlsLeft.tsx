import React from "react";
import { Flex, Image } from "@chakra-ui/react";

export default function ControlsLeft(): JSX.Element {
  return (
    <Flex
      alignItems="center"
      display={{ base: "none", md: "flex" }}
      width="290px"
    >
      <Image alt="logo" width="150px" height="35px" src="/mux-logo.svg" />
    </Flex>
  );
}
