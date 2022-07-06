import React, { useMemo, useRef, useState } from "react";
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

import UserContext from "context/user";

type Props = Pick<ReturnType<typeof useDisclosure>, "isOpen" | "onClose">;

export default function RenameParticipantModal({
  isOpen,
  onClose,
}: Props): JSX.Element {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const user = React.useContext(UserContext);
  const [participantName, setParticipantName] = useState(user.participantName);

  const invalidParticipantName = useMemo(
    () => !participantName,
    [participantName]
  );

  const handleParticipantIdChange = (event: { target: { value: string } }) => {
    setParticipantName(event.target.value);
  };

  const submit = () => {
    if (invalidParticipantName) return;

    user.setPromptForName!(false);
    user.setParticipantName!(participantName);
    onClose();
  };

  return (
    <Modal
      isCentered
      isOpen={isOpen || user.promptForName}
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
