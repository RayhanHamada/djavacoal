import Image from "next/image";

import { EXPORT_COUNTRIES } from "../../lib/constants";

export default function ExportCountriesGrid() {
    return (
        <div className="space-y-4 py-4">
            <h3 className="text-lg font-semibold">
                Countries We Have Exported To
            </h3>
            <p className="text-sm leading-relaxed text-gray-300">
                Djavacoal Indonesia has successfully exported premium charcoal
                products to more than 20 countries across the Middle East, Asia,
                Europe, Africa, Australia, and the Americas. Our global reach
                demonstrates the trust international partners place in our
                quality, reliability, and professionalism. From Saudi Arabia to
                Brazil, from Japan to the USA, Djavacoal continues to serve the
                world with the finest Indonesian charcoal.
            </p>

            {/* Flags Grid */}
            <div className="flex flex-wrap gap-3 rounded-md pt-2">
                {EXPORT_COUNTRIES.map((code) => (
                    <div
                        key={code}
                        className="relative aspect-video h-8 overflow-hidden rounded-sm transition-all lg:h-16"
                    >
                        <Image
                            src={`https://flagsapi.com/${code}/flat/64.png`}
                            alt={`${code} flag`}
                            fill
                            sizes="(max-width: 768px) 2rem, 4rem"
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
