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
            <div className="grid grid-cols-2 items-start justify-start gap-10 max-[1840px]:grid-cols-1">
                {shapes.map((shape, idx) => (
                    <ShapeCard key={idx} {...shape} />
                ))}
            </div>
        </div>
    );
}
