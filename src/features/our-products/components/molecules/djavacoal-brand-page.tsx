import Image from "next/image";

import { CardBrand } from "../atoms/card-brand";
export function DjavacoalBrandPage() {
    return (
        <div className="space-y-12 rounded-xl py-0 lg:bg-[#222222] lg:px-10 lg:py-10">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                    <span className="flex items-center gap-3">
                        <Image
                            src={"/images/logo-mini.png"}
                            alt={"Djavacoal Logo"}
                            width={72}
                            height={46}
                            className="h-[46px] w-auto object-contain"
                        />
                        <h1 className="text-[46px] font-bold text-white">
                            <span className="text-secondary">
                                Djavacoal&apos;s
                            </span>{" "}
                            Brand
                        </h1>
                    </span>
                    <div className="h-px w-full bg-[#393939]" />
                    <div className="flex flex-col items-start justify-start gap-5 py-6">
                        <h2 className="text-2xl font-bold text-white">
                            Description :
                        </h2>
                        <p className="text-l text-justify text-white">
                            At <b>Djavacoal Indonesia</b>, we proudly introduce
                            <span className="text-secondary font-bold">
                                {" "}
                                Golden Cube
                            </span>
                            , our premium brand of coconut shell charcoal
                            briquettes made exclusively for shisha use.{" "}
                            <span className="text-secondary font-bold">
                                {" "}
                                Golden Cube
                            </span>{" "}
                            is produced from 100% natural and sustainable
                            coconut shells, offering consistent heat, long
                            burning duration, minimal ash, and no unwanted odors
                            or chemicals. Each briquette is carefully
                            manufactured using advanced production methods and
                            strict quality control to ensure superior
                            performance that meets international standards. For
                            partners who do not yet have their own brand, we
                            provide the opportunity to market and distribute
                            products under our trusted Golden Cube brand,
                            complete with professional packaging and strong
                            market recognition. We also offer OEM and private
                            label services for clients who wish to create their
                            own brand identity. With Djavacoal, every cube
                            represents quality, reliability, and excellence,
                            making it the preferred choice for global shisha
                            charcoal distributors.
                        </p>
                    </div>
                    <div className="h-px w-full bg-[#393939]" />
                    <div className="flex flex-col items-start justify-start gap-5 py-6">
                        <CardBrand />
                    </div>
                </div>
            </div>
        </div>
    );
}
