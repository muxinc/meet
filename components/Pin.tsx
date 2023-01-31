import React from "react";
import { IconButton } from "@chakra-ui/react";
import { MdPushPin, MdOutlinePushPin } from "react-icons/md";

import UserContext from "context/User";

interface Props {
  connectionId: string;
}

export default function Pin({ connectionId }: Props): JSX.Element {
  const { pinnedConnectionId, setPinnedConnectionId } =
    React.useContext(UserContext);

  return (
    <IconButton
      size="sm"
      opacity={pinnedConnectionId === connectionId ? 1 : 0}
      _groupHover={{
        opacity: 1,
      }}
      aria-label="pin"
      onClick={() => {
        if (setPinnedConnectionId) {
          if (pinnedConnectionId === connectionId) {
            setPinnedConnectionId("");
          } else {
            setPinnedConnectionId(connectionId);
          }
        }
      }}
      variant="ghost"
      position="absolute"
      right={0}
      top={0}
      icon={
        pinnedConnectionId === connectionId ? (
          <MdPushPin />
        ) : (
          <MdOutlinePushPin />
        )
      }
    />
  );
}
