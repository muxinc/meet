import { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";

import { useSpace } from "hooks/useSpace";
import { useUserMedia } from "hooks/useUserMedia";

import Sounds from "./Sounds";
import Toasts from "./Toasts";
import ErrorModal from "./modals/ErrorModal";

export default function Notifications(): JSX.Element {
  const { joinError, screenShareError } = useSpace();
  const { userMediaError } = useUserMedia();
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onErrorModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (joinError) {
      setErrorModalTitle("Error joining space");
      setErrorModalMessage(joinError);
      onErrorModalOpen();
    }
  }, [joinError, onErrorModalOpen]);

  useEffect(() => {
    if (screenShareError === "Permission denied by system") {
      setErrorModalTitle("Can't share your screen");
      setErrorModalMessage(
        "Please check your browser has screen capture permissions and try restarting your browser if you continue to have issues."
      );
      onErrorModalOpen();
    }
  }, [screenShareError, onErrorModalOpen]);

  useEffect(() => {
    if (userMediaError === "NotAllowedError") {
      setErrorModalTitle("Can't show your media");
      setErrorModalMessage(
        "Please check your browser has media capture (webcam and microphone) permissions and try restarting your browser if you continue to have issues."
      );
      onErrorModalOpen();
    }
    if (userMediaError === "OverconstrainedError") {
    }

    return () => {
      onErrorModalClose();
    };
  }, [userMediaError, onErrorModalOpen, onErrorModalClose]);
  return (
    <>
      <Sounds />
      <Toasts />
      <ErrorModal
        title={errorModalTitle}
        message={errorModalMessage}
        isOpen={isErrorModalOpen}
        onClose={onErrorModalClose}
      />
    </>
  );
}
