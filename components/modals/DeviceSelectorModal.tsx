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
} from "@chakra-ui/react";
import DeviceSelector from "../DeviceSelector";

type Props = Pick<ReturnType<typeof useDisclosure>, "isOpen" | "onClose"> &
  React.ComponentProps<typeof DeviceSelector>;

export default function DeviceSelectorModal({
  isOpen,
  onClose,
  ...props
}: Props): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Camera &amp; Microphone Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DeviceSelector {...props} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
