import React from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { copyLinkToastConfig, ToastIds } from "shared/toastConfigs";
import { useSpace } from "hooks/useSpace";
import useWindowDimensions from "hooks/useWindowDimension";

import SettingsIcon from "components/icons/SettingsIcon";
import RenameParticipantModal from "components/modals/RenameParticipantModal";

interface Props {
  onLeave: () => void;
}

export default function SettingsButton({ onLeave }: Props): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isLocalScreenShare } = useSpace();

  const {
    isOpen: isRenameModalOpen,
    onOpen: onRenameModalOpen,
    onClose: onRenameModalClose,
  } = useDisclosure();

  const smallWindowWidth = (width && width < 480) || false;

  const shareLink = () => {
    navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.host}/space/${router.query["id"]}`
    );
    if (!toast.isActive(ToastIds.COPY_LINK_TOAST_ID)) {
      toast(copyLinkToastConfig);
    }
  };

  return (
    <>
      <RenameParticipantModal
        isOpen={isRenameModalOpen}
        onClose={onRenameModalClose}
      />
      <Box>
        <Menu placement="top">
          <MenuButton
            as={IconButton}
            variant="control"
            aria-label="Options"
            icon={<SettingsIcon />}
          />
          <MenuList
            background="#383838"
            border="1px solid #323232"
            color="#CCCCCC"
            padding="5px 10px"
            width="200px"
          >
            <MenuItem disabled={isLocalScreenShare} onClick={onRenameModalOpen}>
              Change Name
            </MenuItem>
            <MenuItem onClick={shareLink}>Copy Invite Link</MenuItem>
            {smallWindowWidth && <MenuItem onClick={onLeave}>Leave</MenuItem>}
          </MenuList>
        </Menu>
      </Box>
    </>
  );
}
