import React from "react";
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

import useWindowDimensions from "hooks/useWindowDimension";

import LeaveIcon from "components/icons/LeaveIcon";

import { copyLinkToastConfig, ToastIds } from "shared/toastConfigs";

interface Props {
  onLeave: () => void;
}

export default function ControlsRight({ onLeave }: Props): JSX.Element {
  const { width } = useWindowDimensions();
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

  const hideCopyInviteLink = (width && width < 930) || false;

  return (
    <Flex
      alignItems="center"
      direction="row-reverse"
      width="290px"
      height="46px"
    >
      <Button
        height="100%"
        background="gradient"
        border="1px solid #666666"
        borderRadius="3px"
        color="white"
        display={{ base: "none", sm: "flex" }}
        fill="white"
        flexDirection="row"
        marginLeft="10px"
        padding="10px 20px"
        onClick={onLeave}
        _hover={{
          background: "#FFFFFF",
          border: "1px solid #999999",
          color: "#666666",
          fill: "#666666",
        }}
      >
        <LeaveIcon />
        <Text paddingLeft="10px">Leave</Text>
      </Button>
      <Button
        height="100%"
        hidden={hideCopyInviteLink}
        variant="ghost"
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
      </Button>
    </Flex>
  );
}
