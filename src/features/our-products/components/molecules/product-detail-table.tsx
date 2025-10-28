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
        <div className="flex flex-col">
            {rows.map((row, idx) => {
                const isOdd = idx % 2 !== 0;
                return (
                    <div
                        key={idx}
                        className={`grid grid-cols-[1fr_2fr] border-b border-[#848484] ${isOdd ? "bg-[#151515]" : "bg-[#262626]"}`}
                    >
                        <div className="border-r border-[#848484] px-3 py-4">
                            <p className="text-base text-white">{row.label}</p>
                        </div>
                        <div className="px-3 py-4">
                            <p className="text-base text-[#B3B3B3]">
                                {row.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
