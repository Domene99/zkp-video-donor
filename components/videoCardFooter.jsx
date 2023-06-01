import {
  CardFooter,
  ButtonGroup,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tag,
} from "@chakra-ui/react";

function ModalButton({ children, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { content, isTopics } = props;

  const topicColors = {
    positive: "green",
    negative: "red",
    neutral: "gray",
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="messenger" size="sm" {...props}>
        {children}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{children}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isTopics
              ? content[0].map((topic, index) => (
                  <Tag colorScheme={topicColors[content[1][index]]} m={1}>
                    {topic}
                  </Tag>
                ))
              : content.map((item) => <Tag m={1}>{item}</Tag>)}
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function VideoCardFooter({ languages, donors, topics }) {
  return (
    <CardFooter>
      <ButtonGroup alignContent={"center"}>
        <ModalButton content={languages}>Languages</ModalButton>
        <ModalButton content={donors}>Donors</ModalButton>
        <ModalButton content={topics} isTopics>
          Topics
        </ModalButton>
      </ButtonGroup>
    </CardFooter>
  );
}
