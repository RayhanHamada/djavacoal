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
        <section className="w-full bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-5 md:px-10 lg:px-20">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10 lg:gap-14">
                    {certificates.map((cert, index) => (
                        <div
                            key={index}
                            className="bg-gradient-radial group flex min-h-[180px] min-w-[180px] flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-[#2A2A2A] from-[#0D0D0D] to-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] hover:shadow-lg hover:shadow-[#EFA12D]/10 md:min-h-[200px] md:min-w-[200px] md:p-8"
                        >
                            <div className="relative flex items-center justify-center">
                                <Image
                                    src={cert.image}
                                    alt={
                                        cert.title || `Certificate ${index + 1}`
                                    }
                                    width={cert.width}
                                    height={cert.height}
                                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            {cert.title && (
                                <div className="flex flex-col items-center gap-0">
                                    <p className="text-center font-['Poppins'] text-[13px] leading-[1.4em] text-white md:text-[15px]">
                                        {cert.title}
                                    </p>
                                    {cert.subtitle && (
                                        <p className="text-center font-['Poppins'] text-[10px] leading-[1.4em] text-[#B0B0B0] md:text-[11px]">
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
