import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormHelperText,
  Input,
} from "@chakra-ui/react";

import UserContext from "context/User";

type Props = Pick<ReturnType<typeof useDisclosure>, "isOpen" | "onClose"> & {
  onRename: (newName: string) => void;
};

export default function RenameParticipantModal({
  onRename,
  isOpen,
  onClose,
}: Props): JSX.Element {
  const user = React.useContext(UserContext);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [participantName, setParticipantName] = useState(user.participantName);

  const invalidParticipantName = useMemo(
    () => !participantName,
    [participantName]
  );

  const handleParticipantIdChange = (event: { target: { value: string } }) => {
    setParticipantName(event.target.value);
  };

  const submit = useCallback(() => {
    if (invalidParticipantName) return;

    if (user.participantName !== participantName) {
      const newParticipantId = user.setParticipantName!(participantName);
      onRename(newParticipantId);
    }
    onClose();
  }, [
    invalidParticipantName,
    onClose,
    onRename,
    participantName,
    user.participantName,
    user.setParticipantName,
  ]);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        setParticipantName(user.participantName);
        onClose();
      }}
      initialFocusRef={nameInputRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{"What's your name?"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={invalidParticipantName}>
            <Input
              maxLength={40}
              ref={nameInputRef}
              id="participant_id"
              value={participantName}
              onChange={handleParticipantIdChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
            />
            <FormHelperText hidden={!invalidParticipantName}>
              This cannot be empty.
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="blue"
            onClick={submit}
            isDisabled={invalidParticipantName}
          >
            Enter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
