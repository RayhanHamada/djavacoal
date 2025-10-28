import Image from "next/image";

export function WhyChooseUsSection() {
    const features = [
        {
            icon: "/images/icon-low-ash.png",
            title: "Low Ash Content",
        },
        {
            icon: "/images/icon-eco-friendly.png",
            title: "Eco Friendly",
        },
        {
            icon: "/images/icon-long-lasting.png",
            title: "Long Lasting",
        },
        {
            icon: "/images/icon-odorless.png",
            title: "Odorless",
        },
        {
            icon: "/images/icon-no-chemical.png",
            title: "No Chemical",
        },
        {
            icon: "/images/icon-premium-quality.png",
            title: "Premium Quality",
        },
        {
            icon: "/images/icon-low-water.png",
            title: "Low Water Content",
        },
        {
            icon: "/images/icon-glowing-heat.png",
            title: "Glowing Heat",
        },
    ];

    return (
        <section className="w-full bg-gradient-to-b bg-[url('/images/bg-banner-header.png')] from-[#1D1D1D]/90 to-transparent bg-cover px-5 py-20 md:px-10 md:py-28 lg:px-20 lg:py-32">
            <div className="container mx-auto">
                <div className="flex flex-col gap-12 md:gap-16">
                    {/* Section Title */}
                    <div className="flex items-center justify-center gap-4 px-5 md:justify-start">
                        <div className="h-0.5 w-[60px] bg-[#EFA12D]" />
                        <h2 className="font-['Josefin_Sans'] text-3xl font-bold text-white md:text-4xl lg:text-[40px]">
                            Why <span className="text-[#EFA12D]">Choose</span>{" "}
                            Us?
                        </h2>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-6 px-5 md:grid-cols-4 lg:gap-10">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-radial group flex flex-col items-center justify-center gap-6 rounded-[20px] border-2 border-[#414141] from-[#151515] to-white/5 px-5 py-8 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] hover:shadow-lg hover:shadow-[#EFA12D]/20 md:px-6 md:py-10"
                            >
                                <div className="relative h-[140px] w-full md:h-[160px] lg:h-[180px]">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        fill
                                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="text-center font-['Josefin_Sans'] text-[13px] leading-tight font-bold text-[#EFA12D] uppercase transition-colors group-hover:text-white md:text-[15px] lg:text-[17px]">
                                    {feature.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
