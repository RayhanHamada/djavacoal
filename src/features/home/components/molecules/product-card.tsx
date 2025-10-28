import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    image: string;
    href: string;
}

export function ProductCard({
    name,
    subtitle,
    description,
    image,
    href,
}: ProductCardProps) {
    return (
        <div className="bg-gradient-radial group relative overflow-hidden rounded-[20px] border border-[#4F4F4F] from-[#151515] to-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] md:p-8">
            {/* Product Image */}
            <div className="relative mb-6 flex h-[200px] items-center justify-center overflow-hidden rounded-[15px] bg-[#1D1D1D] md:h-[250px]">
                <Image
                    src={image}
                    alt={name}
                    width={300}
                    height={300}
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Product Info */}
            <div className="space-y-3">
                <div>
                    <h3 className="font-['Josefin_Sans'] text-[20px] font-bold text-white uppercase md:text-[24px]">
                        {name}
                    </h3>
                    <p className="font-['Open_Sans'] text-[14px] text-[#EFA12D] uppercase md:text-[16px]">
                        {subtitle}
                    </p>
                </div>
                <p className="font-['Open_Sans'] text-[14px] leading-relaxed text-[#C6C6C6] md:text-[15px]">
                    {description}
                </p>

                {/* CTA Button */}
                <Link
                    href={href}
                    className="mt-4 inline-flex items-center gap-2 font-['Open_Sans'] text-[14px] font-semibold text-[#EFA12D] uppercase transition-all hover:gap-3 md:text-[15px]"
                >
                    Detail Products
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform group-hover:translate-x-1"
                    >
                        <path
                            d="M7.5 15L12.5 10L7.5 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
