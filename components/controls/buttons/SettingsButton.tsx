import React, { useState } from "react";
import {
  Box,
  Fade,
  Flex,
  Image,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";

import ControlsButton from "../ControlsButton";
import RenameParticipantModal from "components/modals/RenameParticipantModal";

export default function SettingsButton(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isOpen: isRenameModalOpen,
    onOpen: onRenameModalOpen,
    onClose: onRenameModalClose,
  } = useDisclosure();

  let settingsIcon = (
    <Image
      className="iconExpand"
      alt="settings"
      width="25px"
      height="25px"
      src="/elipsis.svg"
    />
  );

  let ref = React.useRef<any>();
  useOutsideClick({
    ref: ref,
    enabled: isOpen,
    handler: (e) => {
      let icon = e.target as HTMLImageElement;
      // If the icon expand is toggled we need to ignore it so it doesn't reopen
      if (icon && icon.classList && icon.classList.contains("iconExpand"))
        return;

      setIsOpen(!isOpen);
    },
  });

  return (
    <>
      <RenameParticipantModal
        isOpen={isRenameModalOpen}
        onClose={onRenameModalClose}
      />
      <Fade in={isOpen}>
        <Flex
          bg="#383838"
          border="1px solid #323232"
          bottom="90px"
          color="#CCCCCC"
          display={isOpen ? "flex" : "none"}
          flexDirection="column"
          fontSize="14px"
          padding="5px 10px"
          position="absolute"
          ref={ref}
          width="200px"
        >
          <Box
            as="button"
            onClick={onRenameModalOpen}
            paddingY="10px"
            textAlign="left"
          >
            Change Name
          </Box>
        </Flex>
      </Fade>
      <ControlsButton
        className="iconExpand"
        icon={settingsIcon}
        aria-label={"settings"}
        onToggle={() => {
          setIsOpen(!isOpen);
        }}
        onToggleExpand={() => {
          setIsOpen(!isOpen);
        }}
      />
    </>
  );
}
