import { cva } from "class-variance-authority";
import React, { ButtonHTMLAttributes } from "react";

export const buttonStyles = cva(
  "inline-flex items-center justify-center font-mona rounded-md focus:outline-none gap-0.5",
  {
    variants: {
      intent: {
        primary: "bg-gradient-to-b from-violet-700 to-purple-700 border border-violet-900 text-white",
        secondary: "bg-violet-100 hover:bg-violet-200 border border-violet-50 text-violet-950"
      },
      size: {
        small: "p-2 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg"
      }
    },
    defaultVariants: {
      intent: "primary",
      size: "medium"
    }
  }
);

interface ButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  startIcon?: React.ReactNode
}

const Button: React.FC<ButtonInterface> = ({intent, size, startIcon, children, ...props}) => {
  return (
    <>
      <button className={buttonStyles({ intent, size })} {...props}>
        {startIcon}{ children }
      </button>
    </>
  )
}

export default Button