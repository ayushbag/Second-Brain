import { ReactElement } from "react";
import { IconSizeInterface } from "./types";

const IconSize = {
  "sm": "size-4",
  "md": "size-5",
  "lg": "size-6",
}

export function PlusIcon(props: IconSizeInterface):ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={IconSize[props.size]}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}
