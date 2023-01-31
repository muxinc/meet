import React, { useCallback, useMemo, useState } from "react";
import { IconButton, Center, Flex } from "@chakra-ui/react";

import { MAX_PARTICIPANTS_PER_PAGE } from "lib/constants";

import UserContext from "context/User";

import { useSpace } from "hooks/useSpace";

import Participant from "./Participant";
import GalleryLayout from "./GalleryLayout";
import ParticipantAudio from "./ParticipantAudio";
import ChevronLeftIcon from "components/icons/ChevronLeftIcon";
import ChevronRightIcon from "components/icons/ChevronRightIcon";

interface Props {
  gap: number;
  width: number;
  height: number;
  participantsPerPage: number;
}

export default function Gallery({
  gap,
  width,
  height,
  participantsPerPage = MAX_PARTICIPANTS_PER_PAGE,
}: Props): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const { connectionIds, participantCount } = useSpace();
  const { pinnedConnectionId } = React.useContext(UserContext);

  const sortedConnectionIds = useMemo(() => {
    return [...connectionIds].sort((a, b) => {
      if (a === pinnedConnectionId) {
        return -1;
      } else if (b === pinnedConnectionId) {
        return 1;
      } else {
        return 0;
      }
    });
  }, [connectionIds, pinnedConnectionId]);

  const numberPages = useMemo(() => {
    if (participantCount >= participantsPerPage) {
      return Math.ceil(participantCount / participantsPerPage);
    } else {
      return 1;
    }
  }, [participantCount, participantsPerPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [currentPage]);

  const paginatedConnectionIds = useMemo(() => {
    const startIndex = currentPage * participantsPerPage - participantsPerPage;
    const endIndex = startIndex + participantsPerPage;
    const pageParticipants = sortedConnectionIds.slice(startIndex, endIndex);
    // if there are no participants, then only the local view will show up on the page
    // we need to go back to the previous page.
    if (pageParticipants.length === 0) {
      goToPreviousPage();
    }
    return pageParticipants;
  }, [sortedConnectionIds, currentPage, participantsPerPage, goToPreviousPage]);

  const hidePaginateCtrlRight = currentPage === numberPages;

  const hidePaginateCtrlLeft = currentPage === 1;

  const goToNextPage = () => {
    if (currentPage < numberPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  const widthBetweenPagination = numberPages === 1 ? width : width - 80;

  return (
    <Flex height="100%" justifyContent="space-between">
      <Center w="40px" marginLeft="12px">
        <IconButton
          aria-label="Paginate left"
          icon={<ChevronLeftIcon />}
          isRound={true}
          onClick={goToPreviousPage}
          opacity={numberPages === 1 ? 0 : 1}
          hidden={hidePaginateCtrlLeft}
          variant="outline"
          border="1px"
          borderColor="#666666"
          backgroundColor="#383838"
          _hover={{
            border: "1px solid #CCCCCC",
            backgroundColor: "#383838",
          }}
          _active={{
            border: "1px solid #CCCCCC",
            backgroundColor: "#444444",
          }}
        />
      </Center>
      <Center width={width} zIndex={100}>
        {connectionIds.map((connectionId) => (
          <ParticipantAudio key={connectionId} connectionId={connectionId} />
        ))}
        <GalleryLayout
          width={widthBetweenPagination}
          height={height}
          gap={gap - 6}
        >
          {paginatedConnectionIds.map((connectionId) => {
            return (
              <Participant key={connectionId} connectionId={connectionId} />
            );
          })}
        </GalleryLayout>
      </Center>
      <Center w="40px" marginRight="12px">
        <IconButton
          aria-label="Paginate right"
          icon={<ChevronRightIcon />}
          isRound={true}
          opacity={numberPages === 1 ? 0 : 1}
          hidden={hidePaginateCtrlRight}
          variant="outline"
          border="1px"
          borderColor="#666666"
          onClick={goToNextPage}
          backgroundColor="#383838"
          _hover={{
            border: "1px solid #CCCCCC",
            backgroundColor: "#383838",
          }}
          _active={{
            border: "1px solid #CCCCCC",
            backgroundColor: "#444444",
          }}
          zIndex={2}
        />
      </Center>
    </Flex>
  );
}
