import React from "react";
import Image from "next/image";

import screenShare from "../../public/screen-share.svg";

export default function ScreenShareIcon(): JSX.Element {
  return (
    <Image
      priority
      alt="Screen share"
      width={25}
      height={25}
      src={screenShare}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
