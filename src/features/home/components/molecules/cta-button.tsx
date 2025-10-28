import Link from "next/link";

interface CTAButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
}

export function CTAButton({
    href,
    children,
    variant = "primary",
    className = "",
}: CTAButtonProps) {
    const baseClasses =
        "rounded-[40px] border-2 px-8 py-3 font-['Open_Sans'] text-[14px] font-semibold uppercase transition-all md:px-10 md:py-4 md:text-[15px]";

    const variantClasses = {
        primary:
            "border-[#EFA12D] bg-[#EFA12D] text-[#151515] hover:bg-transparent hover:text-[#EFA12D]",
        secondary:
            "border-white bg-black/40 text-white backdrop-blur-sm hover:bg-black/60",
        outline:
            "border-[#EFA12D] bg-transparent text-[#EFA12D] hover:bg-[#EFA12D] hover:text-[#151515]",
    };

    return (
        <Link
            href={href}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </Link>
    );
}
