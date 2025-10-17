import Image from "next/image";

export default function HeaderSection() {
  return (
    <section className="relative w-full bg-[#1C1C1C] text-white overflow-hidden">
      {/* Background Image */}
      <div className="relative w-full h-48 md:h-72">
        <Image
          src="/images/bg-banner-header.png"
          alt="Production Info Banner"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-semibold italic">
            Production Info
          </h1>
        </div>
      </div>
    </section>
  );
}
