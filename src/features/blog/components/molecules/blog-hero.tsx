import { cn } from "@/lib/utils";

interface BlogHeroProps {
    title: string;
    className?: string;
}

export function BlogHero({ title, className }: BlogHeroProps) {
    return (
        <div
            className={cn(
                "relative flex h-[350px] w-full flex-col items-center justify-center gap-[214px] overflow-hidden",
                "bg-gradient-radial from-[rgba(219,172,102,1)] from-[72%] to-[rgba(21,21,21,0.3)] to-[39%]",
                className
            )}
            style={{
                backgroundImage: "url(/images/bg-banner-header.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="relative z-10 flex flex-col items-center gap-2.5">
                <h1 className="font-josefin text-4xl leading-[1.277em] font-bold text-white">
                    {title}
                </h1>
            </div>
            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-[#474747]" />
        </div>
    );
}
