import { cva } from "class-variance-authority";
import React, { ButtonHTMLAttributes } from "react";

export const buttonStyles = cva(
  "inline-flex items-center justify-center font-mona rounded-md focus:outline-none text-center leading-tight",
  {
    variants: {
      intent: {
        primary: "bg-gradient-to-b from-violet-700 to-violet-500 border border-violet-900 text-white",
        secondary: "bg-white hover:bg-white border border-white text-violet-800"
      },
      size: {
        mobile: "p-1.5",
        small: "p-2",
        medium: "px-4 py-2 text-base gap-0.5",
        large: "px-6 py-3 text-lg gap-0.5"
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
  size?: "small" | "medium" | "large" | "mobile";
  startIcon?: React.ReactNode
}

const Button: React.FC<ButtonInterface> = ({intent, size, startIcon, children, ...props}) => {
  return (
    <>
      <button className={buttonStyles({ intent, size })} {...props}>
      {startIcon && (
        <span className="flex items-center justify-center">
          {startIcon}
        </span>
      )}
      <span className="items-center hidden md:block">{children}</span>
    </button>
    </>
  )
}

export default Button