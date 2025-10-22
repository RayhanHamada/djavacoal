"use client";

import { useState } from "react";

import { FilterButton } from "../atoms";

type ProductCategoryDropdownProps = {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
};

export function ProductCategoryDropdown({
    categories,
    selectedCategory,
    onCategoryChange,
}: ProductCategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (category: string) => {
        onCategoryChange(category);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-3 rounded-lg bg-[rgba(41,45,50,0.85)] p-4 backdrop-blur-[14px]">
            <FilterButton onClick={() => setIsOpen(!isOpen)} />

            <div className="relative flex-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between gap-40 rounded border border-[#474747] bg-[#161616] px-5 py-3 text-base text-[#C6C6C6]"
                >
                    <span>{selectedCategory}</span>
                    <svg
                        width="29"
                        height="29"
                        viewBox="0 0 29 29"
                        fill="none"
                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    >
                        <path
                            d="M12.08 20.54L18.12 14.5L12.08 8.46"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded bg-[rgba(41,45,50,0.9)] shadow-lg backdrop-blur-[7px]">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleSelect(category)}
                                className="w-full border-b border-[#424C59] px-5 py-3 text-left text-base text-[#C6C6C6] transition-colors last:border-b-0 hover:bg-[#9D7B19] hover:text-white"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
