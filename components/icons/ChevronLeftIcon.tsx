import React from "react";
import Image from "next/image";

import chevronLeft from "../../public/chevronLeft.svg";

export default function ChevronLeftIcon(): JSX.Element {
  return <Image alt="paginate left" width={7} height={12} src={chevronLeft} />;
}
