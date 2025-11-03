import type { Certificate } from "../../lib/types";

import Image from "next/image";

import { WATERMARK_IMAGE } from "../../lib/constants";

interface CertificateCardProps {
    certificate: Certificate;
}

export default function CertificateCard({
    certificate: { src, alt },
}: CertificateCardProps) {
    return (
        <div className="relative w-full overflow-hidden rounded-md border border-[#333] bg-black">
            {/* Certificate Image */}
            <Image
                src={src}
                alt={alt}
                width={600}
                height={850}
                className="h-auto w-full object-contain"
                priority
            />

            {/* Watermark Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <Image
                    src={WATERMARK_IMAGE}
                    alt="Watermark"
                    width={200}
                    height={200}
                    className="object-contain"
                />
            </div>
        </div>
    );
}
