import React from "react";
import Image from "next/image";

import screenShareOff from "../../public/screenShareOff.svg";

export default function ScreenShareOffIcon(): JSX.Element {
  return (
    <Image
      priority
      alt="screen share off"
      width={25}
      height={25}
      src={screenShareOff}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
