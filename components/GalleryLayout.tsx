import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useMemo,
} from "react";
import { Flex } from "@chakra-ui/react";

import { calcOptimalBoxes } from "lib/gallery";

interface Props {
  gap?: number;
  width: number;
  height: number;
  children: ReactNode;
}

const GalleryLayout = ({ children, width, height, gap = 10 }: Props) => {
  const bestFit = useMemo(() => {
    if (children) {
      return calcOptimalBoxes(
        width,
        height,
        Children.count(children),
        16 / 9,
        gap
      );
    }
  }, [children, width, height, gap]);

  return (
    <Flex
      wrap="wrap"
      width="100%"
      height="100%"
      gap={`${gap}px`}
      overflow="hidden"
      alignItems="center"
      alignContent="center"
      justifyContent="center"
    >
      {Children.map(children, (child) => {
        if (
          isValidElement(child) &&
          bestFit &&
          bestFit.width &&
          bestFit.height
        ) {
          return cloneElement(child as React.ReactElement<any>, {
            width: bestFit.width,
            height: bestFit.height,
          });
        } else {
          return child;
        }
      })}
    </Flex>
  );
};

export default GalleryLayout;
