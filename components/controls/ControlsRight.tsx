import React from "react";
import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useSpace } from "hooks/useSpace";
import LeaveIcon from "components/icons/leave";
import { copyLinkToastConfig, ToastIds } from "shared/toastConfigs";

export default function ControlsRight(): JSX.Element {
  const space = useSpace();
  const router = useRouter();
  const toast = useToast();

  const shareLink = () => {
    navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.host}/space/${router.query["id"]}`
    );
    if (!toast.isActive(ToastIds.COPY_LINK_TOAST_ID)) {
      toast(copyLinkToastConfig);
    }
  };

  return (
    <Flex alignItems="center" flexDirection="row-reverse" width="290px">
      <Box
        alignItems="center"
        aria-label="Leave room"
        as="button"
        background="linear-gradient(90deg, #fb3c4e 0%, #fb2491 100%)"
        border="1px solid #666666"
        borderRadius="3px"
        color="white"
        display={{ base: "none", sm: "flex" }}
        fill="white"
        flexDirection="row"
        marginLeft="10px"
        mix-blend-mode="normal"
        padding="10px 20px"
        onClick={() => {
          space?.leave();
          router.push("/");
        }}
        _hover={{
          background: "#FFFFFF",
          border: "1px solid #999999",
          color: "#666666",
          fill: "#666666",
        }}
      >
        <LeaveIcon />
        <Text paddingLeft="10px">Leave</Text>
      </Box>
      <Box
        aria-label="Copy invite link"
        as="button"
        backgroundColor="none"
        border="1px solid #666666"
        borderRadius="3px"
        color="#CCCCCC"
        display={{ base: "none", md: "flex" }}
        onClick={shareLink}
        padding="10px 20px"
        _hover={{
          border: "1px solid #CCCCCC",
        }}
      >
        Copy invite link
      </Box>
    </Flex>
  );
}
