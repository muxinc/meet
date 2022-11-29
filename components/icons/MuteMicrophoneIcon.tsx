import React from "react";
import Image from "next/image";

import microphoneOffIcon from "../../public/microphoneOff.svg";

export default function MuteMicrophoneIcon(): JSX.Element {
  return (
    <Image
      alt="mute mic"
      width={25}
      height={25}
      src={microphoneOffIcon}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
