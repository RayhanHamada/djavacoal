"use client";

import Image from "next/image";

type FilterButtonProps = {
    onClick: () => void;
};

export function FilterButton({ onClick }: FilterButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center"
            aria-label="Filter products"
        >
            <Image
                src="/images/filter-icon.svg"
                alt="Filter"
                width={40}
                height={40}
            />
        </button>
    );
}
