"use client";

type DetailRow = {
    label: string;
    value: string;
};

type ProductDetailTableProps = {
    rows: DetailRow[];
};

export function ProductDetailTable({ rows }: ProductDetailTableProps) {
    return (
        <div className="flex w-full flex-col overflow-hidden border border-[#848484]">
            {rows.map((row, idx) => {
                const isOdd = idx % 2 !== 0;
                return (
                    <div
                        key={idx}
                        className={`grid grid-cols-[minmax(100px,1fr)_minmax(200px,2fr)] ${idx !== rows.length - 1 ? "border-b border-[#848484]" : ""} ${isOdd ? "bg-primary" : "bg-[#262626]"}`}
                    >
                        <div className="border-r border-[#848484] px-3 py-4">
                            <p className="text-sm wrap-break-word text-white sm:text-base">
                                {row.label}
                            </p>
                        </div>
                        <div className="px-3 py-4">
                            <p className="text-sm wrap-break-word text-[#B3B3B3] sm:text-base">
                                {row.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
