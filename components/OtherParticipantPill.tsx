import React from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { LocalParticipant, RemoteParticipant } from "@mux/spaces-web";

interface Props {
  onSelect: (participant: LocalParticipant | RemoteParticipant) => void;
  participants: (RemoteParticipant | LocalParticipant)[];
}

export default function OtherParticipantsPill({
  onSelect,
  participants,
}: Props): JSX.Element {
  return (
    <Menu placement="top" offset={[66, 6]}>
      <MenuButton
        as={Button}
        position="absolute"
        borderRadius="12px"
        bottom="10px"
        color="#666666"
        fontSize="12px"
        fontWeight="700"
        left="10px"
        height="auto"
        padding="4px 10px"
        background="#E8E8E8"
        zIndex="100"
      >
        + {participants.length} others
      </MenuButton>
      <MenuList
        bg="#383838"
        border="1px solid #323232"
        color="#CCCCCC"
        fontSize="14px"
        padding="5px 10px"
        width="100px"
        borderRadius="0"
        zIndex="100"
      >
        {participants.map((participant) => {
          return (
            <MenuItem
              key={participant.id}
              onClick={() => {
                onSelect(participant);
              }}
              textAlign="left"
              paddingY="10px"
            >
              {participant.id.split("|")[0]}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
