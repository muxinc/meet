import { Box } from "@chakra-ui/react";
import { UseToastOptions } from "@chakra-ui/react";

export enum ToastIds {
  COPY_LINK_TOAST_ID,
  SHARING_SCREEN_TOAST_ID,
  BROADCASTING_SCREEN_TOAST_ID,
  VIEWING_SHARED_SCREEN_TOAST_ID,
}

export const copyLinkToastConfig: UseToastOptions = {
  id: ToastIds.COPY_LINK_TOAST_ID,
  position: "top",
  render: () => {
    return (
      <Box
        color="#0a0a0b"
        background="#cff1fc"
        fontSize="14px"
        padding="15px 50px"
        textAlign="center"
      >
        Share link copied to your clipboard.
      </Box>
    );
  },
};

export const sharingScreenToastConfig: UseToastOptions = {
  id: ToastIds.SHARING_SCREEN_TOAST_ID,
  position: "top",
  duration: null,
};

export const viewingSharedScreenToastConfig: UseToastOptions = {
  id: ToastIds.VIEWING_SHARED_SCREEN_TOAST_ID,
  position: "top",
  duration: null,
};

export const broadcastingToastConfig: UseToastOptions = {
  id: ToastIds.BROADCASTING_SCREEN_TOAST_ID,
  position: "top-left",
  duration: null,
};

export const participantEventToastConfig: UseToastOptions = {
  // Don't set id, as we expect to have multiple on screen at the same time
  isClosable: true,
  position: "top-right",
  duration: 3000,
};
