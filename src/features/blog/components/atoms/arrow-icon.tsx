import { cn } from "@/lib/utils";

interface ArrowIconProps {
    className?: string;
    direction?: "right" | "left";
}

export function ArrowIcon({ className, direction = "right" }: ArrowIconProps) {
    return (
        <svg
            width="17"
            height="14"
            viewBox="0 0 17 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "flex-shrink-0",
                direction === "left" && "rotate-180",
                className
            )}
        >
            <path
                d="M16.7071 7.70711C17.0976 7.31658 17.0976 6.68342 16.7071 6.29289L10.3431 -0.0711455C9.95262 -0.461669 9.31946 -0.461669 8.92893 -0.0711455C8.53841 0.319378 8.53841 0.952543 8.92893 1.34307L14.5858 7L8.92893 12.6569C8.53841 13.0474 8.53841 13.6806 8.92893 14.0711C9.31946 14.4617 9.95262 14.4617 10.3431 14.0711L16.7071 7.70711ZM0 8H16V6H0V8Z"
                fill="currentColor"
            />
        </svg>
    );
}
