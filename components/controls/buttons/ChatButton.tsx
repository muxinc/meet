import React, { useContext } from "react";
import { IconButton, Tooltip } from "@chakra-ui/react";

import ChatIcon from "../../icons/ChatIcon";
import ChatContext from "context/Chat";
import styled from "@emotion/styled";

interface Props {
  isActive: boolean;
  hasNotifications: boolean;
}

const UnreadCircle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #fa50b5;
  top: calc(50% - 17.5px);
  right: calc(50% - 17.5px);
`;

export default function ChatButton(): JSX.Element {
  const { numUnreadMessages, isChatOpen, openChat, closeChat } =
    useContext(ChatContext);

  return (
    <Tooltip label={isChatOpen ? "Close chat" : "Open chat"}>
      <IconButton
        variant="control"
        aria-label="Toggle chat"
        icon={
          <>
            <ChatIcon />
            {numUnreadMessages > 0 && <UnreadCircle />}
          </>
        }
        {...(isChatOpen && {
          background: "#3E4247",
          border: "1px solid #FFFFFF",
        })}
        onClick={isChatOpen ? closeChat : openChat}
      />
    </Tooltip>
  );
}
