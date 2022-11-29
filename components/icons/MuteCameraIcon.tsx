import React from "react";
import Image from "next/image";

import cameraOnIcon from "../../public/cameraOn.svg";

export default function MuteCameraIcon(): JSX.Element {
  return (
    <Image
      alt="mute camera"
      width={25}
      height={25}
      src={cameraOnIcon}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
