import Image from "next/image";

interface CertificateCardProps {
    image: string;
    title: string;
    subtitle?: string;
    width: number;
    height: number;
}

export function CertificateCard({
    image,
    title,
    subtitle,
    width,
    height,
}: CertificateCardProps) {
    return (
        <div className="bg-gradient-radial flex flex-col items-center justify-center gap-2 rounded-lg border border-[#4F4F4F] from-[#151515] to-white/10 p-4 md:p-6">
            <div className="relative flex items-center justify-center">
                <Image
                    src={image}
                    alt={title || "Certificate"}
                    width={width}
                    height={height}
                    className="object-contain"
                />
            </div>
            {title && (
                <div className="flex flex-col items-center gap-0">
                    <p className="text-center font-['Poppins'] text-[14px] leading-[1.5em] text-white md:text-[17px]">
                        {title}
                    </p>
                    {subtitle && (
                        <p className="text-center font-['Poppins'] text-[10px] leading-[1.5em] text-white md:text-[12px]">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
