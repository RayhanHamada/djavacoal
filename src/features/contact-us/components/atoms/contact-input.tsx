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
    <div className="flex flex-col mb-4 w-full">
      <label className="text-sm mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-[#2B2B2B] text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}
