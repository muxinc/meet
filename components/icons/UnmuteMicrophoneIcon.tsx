import React from "react";
import Image from "next/image";

import microphoneOnIcon from "../../public/microphoneOn.svg";

export default function UnmuteMicrophoneIcon(): JSX.Element {
  return (
    <Image
      priority
      alt="unmute mic"
      width={25}
      height={25}
      src={microphoneOnIcon}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
