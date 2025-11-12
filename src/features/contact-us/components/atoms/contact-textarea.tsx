interface ContactTextareaProps {
    label: string;
    placeholder: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ContactTextarea({
    label,
    placeholder,
    name,
    value,
    onChange,
}: ContactTextareaProps) {
    return (
        <div className="mb-4 flex w-full flex-col">
            <label className="mb-1 text-sm">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
                className="w-full rounded-md bg-[#2B2B2B] px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none lg:h-[188px]"
            />
        </div>
    );
}
