interface ContactButtonProps {
    text: string;
    disabled?: boolean;
}

export function ContactButton({ text, disabled }: ContactButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className={`w-full rounded-md px-8 py-2 font-semibold text-white transition lg:w-auto ${
                disabled
                    ? "cursor-not-allowed bg-[#3a3a3a]"
                    : "bg-button-whatsapp hover:bg-green-500"
            }`}
        >
            {text}
        </button>
    );
}
