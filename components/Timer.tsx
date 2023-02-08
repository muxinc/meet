import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Tooltip } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { MdTimer } from "react-icons/md";
import moment from "moment";

import { useSpace } from "hooks/useSpace";

const Display = styled.div<{ isUrgent: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: end;
  background-color: #383838;
  padding: 0.5em;
  top: 12px;
  right: 12px;
  font-size: 1.5em;
  font-variant-numeric: tabular-nums;
  color: white;
  user-select: none;
  border-radius: 3px;
  z-index: 200;

  ${(props) =>
    props.isUrgent &&
    `
  #countdown {
    color: red;
  }
  `}
`;

const getClock = (diff: number) => {
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const minuteDisplay = 10 > minutes ? "0" + minutes : minutes;
  const secondDisplay = 10 > seconds ? "0" + seconds : seconds;

  return `${minuteDisplay}:${secondDisplay}`;
};

const Timer = (): JSX.Element => {
  const { spaceEndsAt, leaveSpace } = useSpace();
  const diff = moment(spaceEndsAt).diff(moment());
  const [timeDisplay, setTimeDisplay] = useState<string>(
    spaceEndsAt ? getClock(diff) : "00:00"
  );
  const router = useRouter();
  const twoMinutesleft = 120 >= Math.floor(diff / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = moment(spaceEndsAt).diff(moment());

      if (diff > 0) {
        setTimeDisplay(getClock(diff));
      } else {
        leaveSpace();
        router.push("/");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [router, leaveSpace, spaceEndsAt]);

  return (
    <Tooltip label="This demo space will close after the timer expires.">
      <Display isUrgent={twoMinutesleft}>
        <span>Time Left</span>
        <span id="countdown">{timeDisplay}</span>
      </Display>
    </Tooltip>
  );
};

export default Timer;