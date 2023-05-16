import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import LeaveIcon from "components/icons/LeaveIcon";
import SpaceContext from "context/Space";
import styled from "@emotion/styled";
import useWindowDimensions from "hooks/useWindowDimension";

interface Props {
  onLeave: () => void;
}

const ParticipantsLabel = styled.span`
  color: #cccccc;
  font-size: 12px;
  line-height: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const ParticipantCount = styled.span`
  font-size: 21px;
  line-height: 21px;
  letter-spacing: -0.5px;
  margin-top: 5px;
`;

export default function ControlsRight({ onLeave }: Props): JSX.Element {
  const { participantCount } = React.useContext(SpaceContext);

  const { width } = useWindowDimensions();
  const hideParticipantCount = (width && width < 1000) || false;

  return (
    <Flex
      alignItems="center"
      direction="row-reverse"
      width="290px"
      height="46px"
    >
      <Button
        variant="muxDestructive"
        display={{ base: "none", sm: "flex" }}
        flexDirection="row"
        marginLeft="30px"
        padding="10px 20px"
        onClick={onLeave}
      >
        <LeaveIcon />
        <Text paddingLeft="10px">Leave</Text>
      </Button>
      <Flex
        alignItems="center"
        direction="column"
        color="white"
        fontWeight="bold"
        marginTop="2px"
      >
        {!hideParticipantCount && (
          <>
            <ParticipantsLabel>Participants</ParticipantsLabel>
            <ParticipantCount>{participantCount}</ParticipantCount>
          </>
        )}
      </Flex>
    </Flex>
  );
}
