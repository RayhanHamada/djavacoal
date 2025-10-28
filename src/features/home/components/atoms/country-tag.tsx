interface CountryTagProps {
    name: string;
}

export function CountryTag({ name }: CountryTagProps) {
    return (
        <span className="rounded-full border border-[#4F4F4F] bg-[#1D1D1D] px-3 py-1 font-['Open_Sans'] text-[12px] text-[#C6C6C6] md:text-[13px]">
            {name}
        </span>
    );
}
