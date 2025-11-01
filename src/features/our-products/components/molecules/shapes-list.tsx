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
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10">
                {shapes.map((shape, idx) => (
                    <ShapeCard key={idx} {...shape} />
                ))}
            </div>
        </div>
    );
}
