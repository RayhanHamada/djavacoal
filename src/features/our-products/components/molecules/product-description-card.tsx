interface ProductDescriptionCardProps {
    description: string;
}

export function ProductDescriptionCard({
    description,
}: ProductDescriptionCardProps) {
    return (
        <div className="rounded-lg bg-gray-800/50 p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#EFA12D]">
                Description:
            </h3>
            <p className="text-sm leading-relaxed text-gray-300">
                {description}
            </p>
        </div>
    );
}
