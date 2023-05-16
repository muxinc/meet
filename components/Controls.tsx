import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { Flex, useDisclosure } from "@chakra-ui/react";

import { useSpace } from "hooks/useSpace";

import ControlsRight from "./controls/ControlsRight";
import ControlsLeft from "./controls/ControlsLeft";
import ControlsCenter from "./controls/ControlsCenter";
import ACRScoreDialog from "./modals/ACRScoreDialog";

export default function Controls(): JSX.Element {
  const router = useRouter();
  const { leaveSpace } = useSpace();
  const { isOpen: isACRScoreDialogOpen, onOpen: onACRScoreDialogOpen } =
    useDisclosure();

  const leaveSpacePage = useCallback(() => {
    router.push("/");
  }, [router]);

  const promptForACR = useCallback(() => {
    try {
      leaveSpace();
      onACRScoreDialogOpen();
    } catch (error) {
      console.error(`Unable to properly leave space: ${error}`);
      leaveSpacePage();
    }
  }, [leaveSpace, leaveSpacePage, onACRScoreDialogOpen]);

  return (
    <>
      <ACRScoreDialog isOpen={isACRScoreDialogOpen} onClose={leaveSpacePage} />
      <Flex
        alignItems="center"
        backgroundColor="#0a0a0b"
        bottom="0px"
        flexDirection="row"
        height={{ base: "60px", sm: "80px" }}
        justifyContent="space-between"
        left="0px"
        padding="10px 40px"
        position="fixed"
        width="100%"
        zIndex={1000}
      >
        <ControlsLeft />
        {!isACRScoreDialogOpen && (
          <>
            <ControlsCenter onLeave={promptForACR} />
            <ControlsRight onLeave={promptForACR} />
          </>
        )}
      </Flex>
    </>
  );
}
