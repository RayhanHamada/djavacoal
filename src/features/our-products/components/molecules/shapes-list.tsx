"use client";

import { ShapeCard } from "../atoms";

export type Shape = {
    name: string;
    image: string;
    sizes: string[];
};

type ShapesListProps = {
    shapes: Shape[];
};

export function ShapesList({ shapes }: ShapesListProps) {
    return (
        <div className="flex flex-col gap-10">
            <h3 className="text-xl font-bold text-white">Shape & Size:</h3>
            <div className="flex flex-1 flex-col items-start justify-start gap-5 md:flex-2 md:flex-col 2xl:grid 2xl:grid-cols-2 2xl:gap-5">
                {shapes.map((shape, idx) => (
                    <ShapeCard key={idx} {...shape} />
                ))}
            </div>
        </div>
    );
}
