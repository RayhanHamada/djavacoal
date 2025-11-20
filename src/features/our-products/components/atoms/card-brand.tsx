"use client";

import Image from "next/image";

// Type definition for the card data
export interface CardData {
    id: string;
    imageUrl: string;
    title: string;
    description?: string;
}

// Card Atom Component
export default function Card({ data }: { data: CardData }) {
    return (
        <div className="flex w-full flex-col">
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={data.imageUrl}
                    alt={data.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    priority={false}
                />
            </div>
        </div>
    );
}

export function CardBrand() {
    const mockCards: CardData[] = [
        {
            id: "1",
            imageUrl: "/images/cube-25.png",
            title: "Cube 25",
            description: "- (72 pcs/kg)",
        },
        {
            id: "2",
            imageUrl: "/images/cube-20x50.png",
            title: "Cube 20X50",
            description: "- (64 pcs/kg)",
        },
        {
            id: "3",
            imageUrl: "/images/cube-26.png",
            title: "Cube 26",
            description: "- (64 pcs/kg)",
        },
    ];

    return (
        <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-3">
            {mockCards.map((card) => (
                <div key={card.id} className="flex flex-col">
                    <div className="group relative cursor-pointer overflow-hidden border border-[#FFFFFF25] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff30_100%)] shadow-[0_0_30px_#00000040] transition-all hover:ring-2 hover:ring-[#EFA12D]">
                        <Card data={card} />
                    </div>
                    {/* Text Content */}
                    <div className="mt-4">
                        <h3 className="text-center text-[20px] font-bold text-white">
                            {card.title}{" "}
                            <span className="font-light">
                                {card.description}
                            </span>
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
