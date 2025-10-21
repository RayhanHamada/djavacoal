import type { ProductSpecification } from "../../lib";

interface ProductSpecificationsProps {
    specifications: ProductSpecification[];
}

export function ProductSpecifications({
    specifications,
}: ProductSpecificationsProps) {
    return (
        <div className="overflow-hidden rounded-lg bg-gray-800/50">
            <h3 className="p-6 text-2xl font-semibold text-[#EFA12D]">
                Detail Information:
            </h3>
            <div className="divide-y divide-gray-700">
                {specifications.map((spec, idx) => (
                    <div
                        key={idx}
                        className="grid p-4 transition hover:bg-gray-700/30 sm:grid-cols-3"
                    >
                        <span className="font-semibold text-gray-400">
                            {spec.label}
                        </span>
                        <span
                            className={`sm:col-span-2 ${spec.isHighlighted ? "text-blue-400" : ""}`}
                        >
                            {spec.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
