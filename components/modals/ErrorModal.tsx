import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface Props {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ErrorModal({ title, message, isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{message}</ModalBody>

        <ModalFooter>
          <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
            Dismiss
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
