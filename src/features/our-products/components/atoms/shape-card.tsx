"use client";

import Image from "next/image";

type ShapeCardProps = {
    name: string;
    image: string;
    sizes: string[];
};

export function ShapeCard({ name, image, sizes }: ShapeCardProps) {
    return (
        <div className="flex items-start gap-10 transition-all duration-300">
            {/* Image */}
            <div className="relative flex h-[130px] w-[130px] flex-shrink-0 items-center justify-center rounded-md border border-[#414141] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,_#ffffff40_100%)] from-[#151515] to-[rgba(21,21,21,0.18)]">
                <Image
                    src={image}
                    alt={name}
                    width={130}
                    height={130}
                    className="object-contain group-hover:scale-110"
                />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5">
                <h4 className="text-base font-bold text-white uppercase">
                    {name}:
                </h4>
                <div className="flex flex-col gap-1">
                    {sizes.map((size, idx) => (
                        <p
                            key={idx}
                            className="text-base leading-[23px] text-[#B3B3B3]"
                        >
                            {size}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
