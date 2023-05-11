import React from "react";
import Image from "next/image";

import send from "../../public/send.svg";

export default function SendIcon(): JSX.Element {
  return (
    <Image
      priority
      alt="Send message"
      draggable={false}
      width={18}
      height={15}
      src={send}
      style={{ width: "18px", height: "15px" }}
    />
  );
}
