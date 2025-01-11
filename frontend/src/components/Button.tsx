import { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    size: "sm" | "md" | "lg";
}

const variantClasses = {
    primary: "bg-purple-600 text-white",
    secondary: "bg-purple-200 text-purple-600"
}

const defaultStyles = "rounded-md py-2 px-4 flex items-center justify-center"

const textSize = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg"
} 

export const Button = (props: ButtonProps) => {

    return (
        <button 
            className={`${variantClasses[props.variant]} ${defaultStyles} ${textSize[props.size]}`}
        >
            <div className="pr-2">
                {props.startIcon}
            </div>
                {props.text}
        </button>
    )
} 