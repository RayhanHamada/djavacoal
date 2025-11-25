"use client";

import { useTranslations } from "next-intl";

import { ShapeCard } from "../atoms";

export type Shape = {
    id: number;
    name: string;
    image_url: string;
    sizes: string[];
};

type ShapesListProps = {
    shapes: Shape[];
};

export function ShapesList({ shapes }: ShapesListProps) {
    const t = useTranslations("OurProducts");
    return (
        <div className="flex flex-col gap-10">
            <h3 className="text-xl font-bold text-white">
                {t("sections.shapes")}
            </h3>
            <div className="grid grid-cols-[420px_1fr] items-start justify-start gap-10 max-[1840px]:grid-cols-1">
                {shapes.map((shape) => (
                    <ShapeCard
                        key={shape.id}
                        name={shape.name}
                        image={shape.image_url}
                        sizes={shape.sizes}
                    />
                ))}
            </div>
        </div>
    );
}
