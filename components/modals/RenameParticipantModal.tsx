import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useContext,
} from "react";
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
  Divider,
} from "@chakra-ui/react";

import UserContext from "context/User";
import SpaceContext from "context/Space";

type Props = Pick<ReturnType<typeof useDisclosure>, "isOpen" | "onClose"> & {};

export default function RenameParticipantModal({
  isOpen,
  onClose,
}: Props): JSX.Element {
  const user = React.useContext(UserContext);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [participantName, setParticipantName] = useState(user.participantName);
  const { setDisplayName } = useContext(SpaceContext);

  const invalidParticipantName = useMemo(
    () => !participantName,
    [participantName]
  );

  const handleDisplayNameChanged = (event: { target: { value: string } }) => {
    setParticipantName(event.target.value);
  };

  const handleClose = useCallback(() => {
    setParticipantName(user.participantName);
    onClose();
  }, [onClose, setParticipantName, user]);

  const submit = useCallback(async () => {
    if (invalidParticipantName) return;
    if (user.participantName !== participantName) {
      user.setParticipantName(participantName);
      await setDisplayName(participantName);
    }
    onClose();
  }, [invalidParticipantName, onClose, participantName, setDisplayName, user]);

  return (
    <Modal onClose={handleClose} isOpen={isOpen} isCentered>
      <ModalOverlay />

      <ModalContent borderRadius="0px">
        <ModalHeader color="#242628" fontSize="18px" fontWeight="normal">
          {"What's your name?"}
        </ModalHeader>
        <ModalCloseButton color="#666666" marginTop="6px" marginRight="3px" />
        <Divider color="#E8E8E8" opacity={1} />
        <ModalBody my="17px">
          <FormControl isInvalid={invalidParticipantName}>
            <Input
              maxLength={64}
              ref={nameInputRef}
              id="participant_id"
              value={participantName}
              onChange={handleDisplayNameChanged}
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
          <Button variant="muxDefault" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="muxConfirmation"
            type="submit"
            marginLeft="10px"
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
