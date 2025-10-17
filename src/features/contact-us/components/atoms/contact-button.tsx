interface ContactButtonProps {
  text: string;
}

export function ContactButton({ text }: ContactButtonProps) {
  return (
    <button className="w-full lg:w-auto px-8 py-2 bg-button-whatsapp hover:bg-green-500 text-white font-semibold rounded-md transition">
      {text}
    </button>
  );
}
