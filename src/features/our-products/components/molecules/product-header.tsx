import { Download, MessageCircle } from "lucide-react";

import { ProductButton } from "../atoms";

interface ProductHeaderProps {
    productName: string;
    highlightedName?: string;
}

export function ProductHeader({
    productName,
    highlightedName,
}: ProductHeaderProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                    {highlightedName && (
                        <span className="text-[#EFA12D]">
                            {highlightedName}{" "}
                        </span>
                    )}
                    {productName}
                </h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <ProductButton
                    variant="primary"
                    icon={<Download size={20} />}
                    className="flex-1"
                >
                    Catalogue
                </ProductButton>
                <ProductButton
                    variant="secondary"
                    icon={<MessageCircle size={20} />}
                    className="flex-1"
                >
                    Ask More
                </ProductButton>
            </div>
        </div>
    );
}
