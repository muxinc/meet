import Image from "next/image";

import elipsisIcon from "../../public/elipsis.svg";

export default function SettingsIcon() {
  return (
    <Image
      priority
      alt="settings"
      width={25}
      height={25}
      src={elipsisIcon}
      style={{ width: "25px", height: "25px" }}
    />
  );
}
