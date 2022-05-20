import { Box, Flex, Image } from "@chakra-ui/react";
import React from "react";

interface Props {
  className?: string;
  icon?: React.ReactElement;
  "aria-label": string;
  expandable?: boolean;
  toolTipLabel?: string;
  onToggle: () => void;
  onToggleExpand?: () => void;
}

export default function ControlsButton({
  className,
  icon,
  "aria-label": ariaLabel,
  toolTipLabel,
  expandable,
  onToggle,
  onToggleExpand,
}: Props): JSX.Element {
  let ChevronUp = <Image alt="open menu" src="/chevronUp.svg" />;

  return (
    <Flex alignItems="center" justifyContent="center" marginX="10px">
      <Box
        alignItems="center"
        aria-label={ariaLabel}
        as="button"
        className={className}
        data-tip={toolTipLabel}
        display="flex"
        height="60px"
        justifyContent="center"
        onClick={onToggle}
        padding="12px"
        width="60px"
        _hover={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(251, 36, 145, 0.6) 0%, rgba(251, 36, 145, 0) 100%);",
        }}
      >
        {icon}
      </Box>
      {expandable && (
        <Box
          as="button"
          className={`iconExpand-${ariaLabel}`}
          color="#fff"
          marginLeft="-16px"
          onClick={onToggleExpand}
          padding="8px"
        >
          {ChevronUp}
        </Box>
      )}
    </Flex>
  );
}
