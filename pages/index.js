import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Container,
  VStack,
  Textarea,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import Sentiment from "sentiment";
import { useDebouncedCallback } from "use-debounce";
const sentiment = new Sentiment();

function mapSentimentScore(score) {
  switch (true) {
    case score < 0:
      return "Negative";
    case score > 2:
      return "Positive";
    default:
      return "Neutral";
  }
}

function AlertDialogExample({ isOpen, onClose }) {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Warning
          </AlertDialogHeader>

          <AlertDialogBody>
            This comment is considered as negative.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onClose} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

const Home = () => {
  const [sentimentValue, setSentimentValue] = useState("Neutral");
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const debounced = useDebouncedCallback((text) => setText(text), 500);
  const onClose = () => setIsOpen(false);

  const handleChange = (e) => {
    const result = sentiment.analyze(e.target.value);
    setSentimentValue(mapSentimentScore(result.score));
    debounced(e.target.value);
  };

  return (
    <>
      <Container p={8}>
        <VStack alignItems="flex-end">
          <Textarea onChange={handleChange} minH={24} />
          <HStack spacing={4}>
            <Text fontWeight="semibold">{sentimentValue}</Text>
            <Button
              colorScheme="blue"
              onClick={() => {
                if (sentimentValue === "Negative") {
                  setIsOpen(true);
                }
              }}
              isDisabled={debounced.isPending()}
              isLoading={debounced.isPending()}
              loadingText="Evaluating sentiment"
            >
              Post comment
            </Button>
          </HStack>
        </VStack>
      </Container>
      <AlertDialogExample isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Home;
