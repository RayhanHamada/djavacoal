import type { ProductShape } from "../../lib";

interface ProductShapesProps {
    shapes: ProductShape[];
}

export function ProductShapes({ shapes }: ProductShapesProps) {
    return (
        <div className="rounded-lg bg-gray-800/50 p-6 lg:p-8">
            <h3 className="mb-6 text-2xl font-semibold text-[#EFA12D]">
                Shape & Size:
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {shapes.map((shape, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-16 w-16 rounded-lg bg-gray-700"></div>
                            <h4 className="text-lg font-semibold">
                                {shape.name}:
                            </h4>
                        </div>
                        <ul className="space-y-1 text-sm text-gray-300">
                            {shape.sizes.map((size, sIdx) => (
                                <li key={sIdx}>{size}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
