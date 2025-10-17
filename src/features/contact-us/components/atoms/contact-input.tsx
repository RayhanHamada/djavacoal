interface ContactInputProps {
    label: string;
    type?: string;
    placeholder: string;
}

export function ContactInput({
    label,
    type = "text",
    placeholder,
}: ContactInputProps) {
    return (
        <div className="mb-4 flex w-full flex-col">
            <label className="mb-1 text-sm">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full rounded-md bg-[#2B2B2B] px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
        </div>
    );
}
