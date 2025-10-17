export function ContactMap() {
    return (
        <iframe
            src="https://www.google.com/maps?q=Taiba+Cococha+Indonesia,+Tajurhalang,+Bogor,+West+Java&z=13&output=embed"
            className="h-full w-full rounded-lg grayscale filter transition duration-500 ease-in-out hover:scale-[1.05] hover:grayscale-0"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    );
}
