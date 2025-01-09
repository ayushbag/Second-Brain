import { ReactElement } from "react";

interface ButtonInterface {
    title: string;
    size: "lg" | "sm" | "md";
    startIcon?: ReactElement;
    variant: "primary" | "secondary";
    endIcon?: ReactElement
}

const sizeStyles = {
    "sm": "px-3 py-2 text-sm",
    "md": "px-4 py-2 text-md font-semibold",
    "lg": "px-6 py-3 text-lg",
}

const variantStyles = {
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-300 text-purple-500"
}

const defaultStyles = "rounded-md flex justify-center items-center"

export const Button = (props: ButtonInterface) => {
    return <>
        <div className="m-2">
            <button
                className={`${sizeStyles[props.size]} ${defaultStyles} ${variantStyles[props.variant]}`}
            >
                <div className="flex items-center justify-center">
                    {props.startIcon && <div className="pr-1">{props.startIcon}</div>}
                    {props.title}
                    {props.endIcon && <div className="pl-1">{props.endIcon}</div>}
                </div>
            </button>
        </div>
    </>
}