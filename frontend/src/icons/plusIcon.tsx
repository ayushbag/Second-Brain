import { ReactElement } from "react";
import { IconSizeInterface } from "./types";

const IconSize = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function PlusIcon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
    >
      <path
        fill-rule="evenodd"
        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
