import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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
import { useLocalStorage } from "hooks/useLocalStorage";

type Props = Pick<ReturnType<typeof useDisclosure>, "isOpen" | "onClose">;

export default function RenameParticipantModal({
  isOpen,
  onClose,
}: Props): JSX.Element {
  const {
    isReady,
    pathname,
    push,
    query: { id, participantId: participantIdQueryParam },
  } = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [participantId, setParticipantId] = useLocalStorage(
    "participantId",
    ""
  );
  const [errors, setErrors] = useState<{
    participantId: boolean;
  } | null>(null);

  useEffect(() => {
    if (
      isReady &&
      typeof participantIdQueryParam !== "undefined" &&
      !Array.isArray(participantIdQueryParam)
    ) {
      setParticipantId(participantIdQueryParam);
    } else if (isReady && typeof participantIdQueryParam === "undefined") {
      const storedParticipantId = participantId;
      if (
        storedParticipantId !== null &&
        storedParticipantId !== participantId
      ) {
        setParticipantId(storedParticipantId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, participantIdQueryParam]);

  function handleRename() {
    const participantIdIsInvalid = participantId.length < 2;
    if (participantIdIsInvalid) {
      setErrors({
        participantId: participantIdIsInvalid,
      });
      return;
    }
    setParticipantId(participantId);

    if (participantId !== participantIdQueryParam) {
      push({
        pathname: pathname,
        query: { id, participantId },
      });
    }
  }

  const handleParticipantIdChange = (event: { target: { value: string } }) => {
    setErrors(null);
    setParticipantId(event.target.value);
  };

  const submit = () => {
    handleRename();
    onClose();
  };

  return (
    <Modal
      isCentered
      isOpen={
        isOpen || (isReady && typeof participantIdQueryParam === "undefined")
      }
      onClose={onClose}
      initialFocusRef={nameInputRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`What's your name?`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={errors?.participantId}>
            <Input
              ref={nameInputRef}
              id="participant_id"
              value={participantId}
              onChange={handleParticipantIdChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
            />
            <FormHelperText hidden={!errors?.participantId}>
              This cannot be empty.
            </FormHelperText>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="blue"
            onClick={submit}
            isDisabled={errors?.participantId}
          >
            Enter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
