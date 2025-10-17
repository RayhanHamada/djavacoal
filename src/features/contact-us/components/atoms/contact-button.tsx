interface ContactButtonProps {
    text: string;
}

export function ContactButton({ text }: ContactButtonProps) {
    return (
        <button className="bg-button-whatsapp w-full rounded-md px-8 py-2 font-semibold text-white transition hover:bg-green-500 lg:w-auto">
            {text}
        </button>
    );
}
