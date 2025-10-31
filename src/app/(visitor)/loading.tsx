import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#1a1a1a]">
            <div className="animate-pulse">
                <Image
                    src="/images/logo.png"
                    alt="Djavacoal"
                    width={200}
                    height={60}
                    priority
                />
            </div>
        </div>
    );
}
