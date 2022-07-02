import React from "react";
import { Button, Flex, Image } from "@chakra-ui/react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

import UserContext from "context/user";

export default function UserInteractionPrompt(): JSX.Element {
  const user = React.useContext(UserContext);

  return (
    <Flex
      gap="2rem"
      height="100%"
      overflow="hidden"
      direction="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="#111"
      backgroundImage="url('/starfield-bg.jpg')"
    >
      <Image alt="logo" width="300px" height="70px" src="/mux-logo.svg" />
      <Button
        size="lg"
        rightIcon={<HiOutlineArrowNarrowRight />}
        variant="link"
        color="white"
        onClick={() => user.setInteractionRequired(false)}
      >
        Join Space
      </Button>
    </Flex>
  );
}
