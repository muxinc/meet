import React from "react";
import Image from "next/image";

import cameraOffIcon from "../../public/cameraOff.svg";

export default function UnmuteCameraIcon(): JSX.Element {
  return (
    <Image
      alt="unmute camera"
      width={25}
      height={25}
      src={cameraOffIcon}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
