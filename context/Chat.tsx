import { CustomEvent, SpaceEvent } from "@mux/spaces-web";
import { useSpaceEvent } from "hooks/useSpaceEvent";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import SpaceContext from "./Space";
import { v4 } from "uuid";
import moment from "moment";

interface ChatMessagePayloadValue {
  connectionId: string;
  name: string;
  id: string;
  content: string;
}

interface RemoteChatMessage extends ChatMessagePayloadValue {
  time: string;
}

interface LocalChatMessage extends RemoteChatMessage {
  state: SendState;
}

enum SendState {
  Pending,
  Succeeded,
  Failed,
}

export type ChatMessage = RemoteChatMessage | LocalChatMessage;

interface IChatContext {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  chatMessages: ChatMessage[];
  canSendMessage: boolean;
  numUnreadMessages: number;
  sendChatMessage: (content: string) => Promise<void>;
}

export const ChatContext = createContext({} as IChatContext);

export default ChatContext;

type Props = {
  children: ReactNode;
};

export const ChatProvider: React.FC<Props> = ({ children }) => {
  const { publishCustomEvent, localParticipant } = useContext(SpaceContext);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [numUnreadMessages, setNumUnreadMessages] = useState(0);
  const [canSendMessage, setCanSendMessage] = useState(!!localParticipant);

  const sendChatMessage = useCallback(
    async (content: string) => {
      if (!localParticipant) {
        throw new Error(
          "Cannot send chat message without having joined the space"
        );
      } else if (!canSendMessage) {
        return;
      }

      const id = v4();
      const payload = {
        type: "chat",
        value: {
          connectionId: localParticipant.connectionId,
          name: localParticipant.displayName || localParticipant.id,
          id,
          content,
        },
      };

      const time = moment().format("hh:mm A");
      let state = SendState.Pending;

      const localChatMessage = { ...payload.value, id, state, time };

      setChatMessages([...chatMessages, localChatMessage]);

      try {
        setCanSendMessage(false);
        await publishCustomEvent(JSON.stringify(payload));
        state = SendState.Succeeded;
      } catch (error) {
        state = SendState.Failed;
        throw error;
      } finally {
        const messageIndex = chatMessages.findIndex(
          (message) => message.id === id
        );

        if (messageIndex !== -1) {
          const message = chatMessages[messageIndex];
          if ("state" in message) {
            message.state = state;
          }

          setChatMessages([
            ...chatMessages.slice(0, messageIndex),
            { ...message },
            ...chatMessages.slice(messageIndex + 1),
          ]);
        }
      }
    },
    [localParticipant, chatMessages, publishCustomEvent, canSendMessage]
  );

  useEffect(() => {
    if (localParticipant && !canSendMessage) {
      const timeout = setTimeout(() => {
        setCanSendMessage(true);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [localParticipant, canSendMessage]);

  useSpaceEvent(
    SpaceEvent.ParticipantCustomEventPublished,
    useCallback(
      (participant, customEvent: CustomEvent) => {
        const payload: { type: string; value: ChatMessagePayloadValue } =
          JSON.parse(customEvent.payload);
        if (participant !== localParticipant && payload.type === "chat") {
          setChatMessages([
            ...chatMessages,
            { ...payload.value, time: moment().format("hh:mm A") },
          ]);

          if (!isChatOpen) {
            setNumUnreadMessages(numUnreadMessages + 1);
          }
        }
      },
      [chatMessages, localParticipant, isChatOpen, numUnreadMessages]
    )
  );

  const openChat = useCallback(() => {
    setIsChatOpen(true);
    setNumUnreadMessages(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        openChat,
        closeChat,
        chatMessages,
        canSendMessage,
        numUnreadMessages,
        sendChatMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
