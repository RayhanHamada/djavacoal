import Image from "next/image";

type Props = {
    src: string;
    alt: string;
};

export default function CertificateCard({ src, alt }: Props) {
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
                    src="/images/watermark-legal.png" // ✅ tinggal kamu ganti
                    alt="Watermark"
                    width={200}
                    height={200}
                    className="object-contain"
                />
            </div>
        </div>
    );
}
