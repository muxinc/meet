import React from "react";
import Image from "next/image";

import chevronUp from "../../public/chevronUp.svg";

export default function ChevronIcon(): JSX.Element {
  return (
    <Image priority alt="open menu" width={12} height={8} src={chevronUp} />
  );
}
