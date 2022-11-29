import React from "react";
import Image from "next/image";

import screenShareOn from "../../public/screenShareOn.svg";

export default function ScreenShareOnIcon() {
  return (
    <Image
      alt="screen share on"
      width={25}
      height={25}
      src={screenShareOn}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
