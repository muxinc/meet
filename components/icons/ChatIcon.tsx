import React from "react";
import Image from "next/image";

import chat from "../../public/chat.svg";

export default function ChatIcon(): JSX.Element {
  return (
    <Image
      priority
      alt="toggle chat"
      width={25}
      height={25}
      src={chat}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
