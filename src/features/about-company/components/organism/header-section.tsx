import Image from "next/image";

import { BANNER_IMAGE } from "../../lib/constants";

interface HeaderSectionProps {
    title?: string;
    backgroundImage?: string;
}

export default function HeaderSection({
    title = "About Company",
    backgroundImage = BANNER_IMAGE,
}: HeaderSectionProps) {
    return (
        <section className="relative w-full overflow-hidden bg-[#1C1C1C] text-white">
            <div className="relative h-48 w-full md:h-72">
                <Image
                    src={backgroundImage}
                    alt={`${title} Banner`}
                    fill
                    className="object-cover object-center"
                    priority
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <h1 className="text-2xl font-semibold italic md:text-4xl">
                        {title}
                    </h1>
                </div>
            </div>
        </section>
    );
}
