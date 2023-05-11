import React, {
  FormEvent,
  KeyboardEvent,
  UIEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Textarea } from "@chakra-ui/react";
import styled from "@emotion/styled";
import ChatContext, { ChatMessage } from "context/Chat";
import SendButton from "components/controls/buttons/SendButton";
import { transientOptions } from "lib/utils";

const ChatContainer = styled(Box, transientOptions)<{ $show: boolean }>`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 300px;
  height: 100%;
  background-color: #292929;
  border-left: 1px solid #666666;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);

  ${(props) =>
    props.$show && "transition: transform 100ms; transform: translateX(0%);"}
`;

const ChatMessageListContainer = styled(Box)`
  flex-grow: 1;
  overflow-y: scroll;
  padding-top: 30px;
  padding-bottom: 30px;
`;

const ChatMessageContainer = styled(Box, transientOptions)<{
  $isLastMessage: boolean;
}>`
  position: relative;
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: ${(props) => (props.$isLastMessage ? "0px" : "10px")};
  color: #f9f9f9;
  font-size: 14px;
  white-space: pre-line;
`;

const ChatInputContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 70x;
  padding: 5px;
  border-top: 1px solid #666666;
`;

const ChatTextarea = styled(Textarea)`
  height: 60px;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  background-color: white;
  padding-right: 40px;
  resize: none;
`;

const SendButtonContainer = styled(Box)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 100;
`;

const Name = styled.span`
  font-weight: bold;
`;

const Time = styled.span`
  font-size: 12px;
  color: #cccccc;
  margin-left: 6px;
  vertical-align: top;
`;

const Url = styled.a`
  text-decoration: underline;
`;

interface ChatMessageProps {
  isLast: boolean;
  isConsecutive: boolean;
  message: ChatMessage;
}

const ChatMessage = ({ message, isConsecutive, isLast }: ChatMessageProps) => {
  const urlPositions = [];
  const regexp = /\b(https?:\/\/\S*\b)/g;

  let match;
  while ((match = regexp.exec(message.content)) !== null) {
    urlPositions.push({
      start: match.index,
      end: regexp.lastIndex,
    });
  }

  let content;
  if (urlPositions.length > 0) {
    let oldContent = message.content;
    content = [];

    let currentIndex = 0;
    for (const position of urlPositions) {
      const { start, end } = position;
      content.push(
        <span key={`${currentIndex},${position.start}`}>
          {oldContent.substring(currentIndex, position.start)}
        </span>
      );
      content.push(
        <Url
          target="_blank"
          href={oldContent.substring(start, end)}
          key={`${start},${end}`}
        >
          {oldContent.substring(start, end)}
        </Url>
      );
      currentIndex = end;
    }

    content.push(
      <span key={currentIndex}>{oldContent.substring(currentIndex)}</span>
    );
  } else {
    content = message.content;
  }

  return (
    <ChatMessageContainer $isLastMessage={isLast}>
      {!isConsecutive && (
        <>
          <Name>{message.name}</Name>
          <Time>{message.time}</Time>
          <br />
        </>
      )}
      {content}
    </ChatMessageContainer>
  );
};

export default function ChatRenderer({ show }: { show: boolean }): JSX.Element {
  const { canSendMessage, sendChatMessage, chatMessages } =
    useContext(ChatContext);
  const [input, setInput] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);
  const isScrollNearBottomRef = useRef<boolean>(true);

  const handleOnChange = useCallback((e: FormEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    if (value === "\n" || value.endsWith("\n\n\n") || value.endsWith("\n ")) {
      return;
    }

    setInput(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    const message = input.trim();
    if (canSendMessage && input !== "") {
      setInput("");
      try {
        await sendChatMessage(message);
      } catch (error) {}
    }
  }, [input, canSendMessage, sendChatMessage]);

  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isNearBottom =
      100 > el.scrollHeight - (el.offsetHeight + el.scrollTop);

    isScrollNearBottomRef.current = isNearBottom;
  }, []);

  const renderMessages = useCallback(() => {
    return chatMessages.map((message, index) => (
      <ChatMessage
        key={message.id}
        message={message}
        isConsecutive={
          index !== 0 &&
          message.connectionId === chatMessages[index - 1].connectionId
        }
        isLast={chatMessages.length - 1 === index}
      />
    ));
  }, [chatMessages]);

  useEffect(() => {
    const el = messageListRef.current;
    if (!el || chatMessages.length === 0) return;

    const isLocalMessage = "state" in chatMessages[chatMessages.length - 1];
    if (isScrollNearBottomRef.current || isLocalMessage) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <ChatContainer $show={show}>
      <ChatMessageListContainer ref={messageListRef} onScroll={handleScroll}>
        {renderMessages()}
      </ChatMessageListContainer>
      <ChatInputContainer>
        <ChatTextarea
          placeholder="Send a message"
          draggable={false}
          onChange={handleOnChange}
          value={input}
          onKeyDown={handleOnKeyDown}
        />
        {show && (
          <SendButtonContainer>
            <SendButton
              handleOnClick={handleSubmit}
              isButtonEnabled={canSendMessage && input !== ""}
            />
          </SendButtonContainer>
        )}
      </ChatInputContainer>
    </ChatContainer>
  );
}
