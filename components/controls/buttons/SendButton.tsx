import React, { useContext } from "react";
import { IconButton, Tooltip } from "@chakra-ui/react";

import styled from "@emotion/styled";
import SendIcon from "components/icons/SendIcon";
import { transientOptions } from "lib/utils";

interface Props {
  isButtonEnabled: boolean;
  handleOnClick: () => void;
}

const StatefulSendButton = styled(IconButton, transientOptions)<{
  $isButtonEnabled: boolean;
}>`
  opacity: ${(props) => (props.$isButtonEnabled ? "1" : "0.25")};
  user-select: none;
`;

export default function SendButton({
  isButtonEnabled,
  handleOnClick,
}: Props): JSX.Element {
  return (
    <StatefulSendButton
      tabIndex={-1}
      $isButtonEnabled={isButtonEnabled}
      width="18px"
      height="15px"
      variant="link"
      aria-label="Send message"
      icon={<SendIcon />}
      onClick={handleOnClick}
      disabled={!isButtonEnabled}
    />
  );
}
