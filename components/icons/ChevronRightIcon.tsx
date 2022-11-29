import React from "react";
import Image from "next/image";

import chevronRight from "../../public/chevronRight.svg";

export default function ChevronRightIcon(): JSX.Element {
  return (
    <Image alt="paginate right" width={7} height={12} src={chevronRight} />
  );
}
