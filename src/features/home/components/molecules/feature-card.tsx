import Image from "next/image";

interface FeatureCardProps {
    icon: string;
    title: string;
    description?: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-gradient-radial flex flex-col items-center gap-4 rounded-lg border border-[#414141] from-[#151515] to-white/10 p-5 backdrop-blur-md transition-all hover:border-[#EFA12D] md:p-8">
            <div className="relative h-[177.5px] w-full">
                <Image src={icon} alt={title} fill className="object-contain" />
            </div>
            <h3 className="text-center font-['Josefin_Sans'] text-base leading-none font-bold text-[#EFA12D] uppercase md:text-xl lg:leading-tight">
                {title}
            </h3>
            {description && (
                <p className="text-center font-['Open_Sans'] text-[13px] text-[#C6C6C6] md:text-[14px]">
                    {description}
                </p>
            )}
        </div>
    );
}
