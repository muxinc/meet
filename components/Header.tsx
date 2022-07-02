import React from "react";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";

export default function Header(): JSX.Element {
  return (
    <Flex
      padding="2"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="#292929"
      borderBottom="1px solid #e8e8e8"
    >
      <Flex alignItems="center" padding="10px" width="290px">
        <Image alt="logo" width="150px" height="35px" src="/mux-logo.svg" />
      </Flex>
    </Flex>
  );
}
