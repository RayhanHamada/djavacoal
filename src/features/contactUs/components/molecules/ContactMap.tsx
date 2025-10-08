export function ContactMap() {
  return (
    <iframe
      src="https://www.google.com/maps?q=Taiba+Cococha+Indonesia,+Tajurhalang,+Bogor,+West+Java&z=13&output=embed"
      className="w-full h-full rounded-lg filter grayscale hover:grayscale-0 hover:scale-[1.05] transition duration-500 ease-in-out"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}
