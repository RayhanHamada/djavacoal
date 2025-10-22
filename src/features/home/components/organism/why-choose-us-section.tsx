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
        <section className="w-full bg-gradient-to-b bg-[url('/images/bg-banner-header.png')] from-[#1D1D1D]/81 to-transparent bg-cover py-20 md:py-24 lg:py-32">
            <div className="container mx-auto px-5 md:px-10 lg:px-20">
                <div className="flex flex-col gap-10">
                    {/* Section Title */}
                    <div className="flex items-center gap-5 px-5">
                        <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                        <h2 className="font-['Josefin_Sans'] text-3xl font-bold text-black md:text-4xl lg:text-[36px]">
                            Why Choose Us?
                        </h2>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-5 px-5 md:grid-cols-4 lg:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-radial flex flex-col items-center gap-4 rounded-lg border border-[#414141] from-[#151515] to-white/10 p-5 backdrop-blur-md transition-all hover:border-[#EFA12D] md:p-8"
                            >
                                <div className="relative h-[177.5px] w-full">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-center font-['Josefin_Sans'] text-base leading-none font-bold text-[#EFA12D] uppercase md:text-xl lg:leading-tight">
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
