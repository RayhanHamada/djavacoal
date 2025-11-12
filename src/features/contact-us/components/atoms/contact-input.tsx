interface ContactInputProps {
    label: string;
    type?: string;
    placeholder: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactInput({
    label,
    type = "text",
    placeholder,
    name,
    value,
    onChange,
}: ContactInputProps) {
    return (
        <div className="mb-4 flex w-full flex-col">
            <label className="mb-1 text-sm">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-md bg-[#2B2B2B] px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
        </div>
    );
}
