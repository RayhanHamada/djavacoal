import Image from "next/image";

export function LogoSlideSection() {
    const certificates = [
        {
            image: "/images/ministry_of_trade_logo.png",
            title: "MINISTRY OF TRADE",
            subtitle: "REPUBLIC OF INDONESIA",
            width: 82,
            height: 83,
        },
        {
            image: "/images/100_natural_logo.png",
            title: "",
            subtitle: "",
            width: 88,
            height: 94,
        },
        {
            image: "/images/material_data_safety_sheets_logo.png",
            title: "MATERIAL DATA SAFETY SHEETS",
            subtitle: "",
            width: 190,
            height: 104,
        },
        {
            image: "/images/carsurin_1968_logo.png",
            title: "",
            subtitle: "",
            width: 108.67,
            height: 110,
        },
    ];

    return (
        <section className="w-full bg-gradient-to-b from-[#151515] to-transparent py-10 md:py-12 lg:py-16">
            <div className="container mx-auto px-5 md:px-10 lg:px-20">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                    {certificates.map((cert, index) => (
                        <div
                            key={index}
                            className="bg-gradient-radial flex flex-col items-center justify-center gap-2 rounded-lg border border-[#4F4F4F] from-[#151515] to-white/10 p-4 md:p-6"
                        >
                            <div className="relative flex items-center justify-center">
                                <Image
                                    src={cert.image}
                                    alt={
                                        cert.title || `Certificate ${index + 1}`
                                    }
                                    width={cert.width}
                                    height={cert.height}
                                    className="object-contain"
                                />
                            </div>
                            {cert.title && (
                                <div className="flex flex-col items-center gap-0">
                                    <p className="text-center font-['Poppins'] text-[14px] leading-[1.5em] text-white md:text-[17px]">
                                        {cert.title}
                                    </p>
                                    {cert.subtitle && (
                                        <p className="text-center font-['Poppins'] text-[10px] leading-[1.5em] text-white md:text-[12px]">
                                            {cert.subtitle}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
