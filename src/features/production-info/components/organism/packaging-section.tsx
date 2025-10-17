"use client";
import { motion } from "framer-motion";
import Image from "next/image";

function PackagingCard({
  title,
  image,
  desc,
  type,
}: {
  title: string;
  image: string;
  desc: string;
  type: "Full" | "Bulk" | "Loose";
}) {
  return (
    <article className="bg-[#222222] rounded-xl text-left">
      {/* Title */}
      <h3 className="text-[#EFA12D] font-semibold text-base md:text-lg mb-2 px-1 md:px-0 lg:px-0">
        <span className="text-[#EFA12D] font-bold">{type}</span>{" "}
        <span className="text-[#FFFFFF] font-bold">Packaging:</span>
      </h3>

      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-xl mb-4 flex justify-center">
        <div
          className="
      relative aspect-square overflow-hidden rounded-xl
      w-full max-w-none max-h-none   /* mobile */

      transition-all duration-300
    "
        >
          <Image
            src={image}
            alt={title}
            fill
            className="
        object-contain rounded-xl transition-transform duration-300
        scale-85 lg:scale-90  /* sedikit kecil di desktop */
      "
          />

          {/* Overlay radial gradient */}
          <div
            className="absolute inset-0 rounded-xl z-10 
      bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,rgba(90,90,90,0.3)_30%,rgba(210,210,210,0.65)_70%,rgba(255,255,255,0.98)_100%)]
      mix-blend-overlay"
          />

          {/* Watermark */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <Image
              src="/svgs/logo.svg"
              alt="Djavacoal Watermark"
              width={120}
              height={60}
              className="opacity-90 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Description (align sejajar batas gambar) */}
      <p
        className="
          text-[#CCCCCC] text-sm md:text-base leading-relaxed
          px-1 md:px-2 lg:px-0 /* biar di desktop sejajar dengan gambar */
        "
      >
        {desc}
      </p>
    </article>
  );
}

export default function PackagingSection() {
  return (
    <section id="packaging" className="scroll-mt-28 bg-[#222222] rounded-xl">
      {/* Header */}
      <header className="mb-8 pt-4 px-4 md:px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-[1px] bg-white" />
          <p className="text-sm text-[#60A5FF] font-medium tracking-wide italic">
            Packaging Option
          </p>
        </div>
        <h2 className="text-white text-xl md:text-2xl font-semibold leading-snug">
          Flexible Packaging to Suit Your Business Needs
        </h2>
        <div className="h-[1px] bg-[#3A3A3A] mt-4" />
      </header>

      {/* Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-8 md:px-6"
      >
        <PackagingCard
          type="Full"
          title="Full Packaging"
          image="/images/pack-full.png"
          desc="Designed for retail and private label brands, this option includes inner plastic, inner box, and master box. It ensures your brand stands out on the market while keeping products safe and ready for direct distribution to customers."
        />
        <PackagingCard
          type="Bulk"
          title="Bulk Packaging"
          image="/images/pack-bulk.png"
          desc="Best suited for wholesale buyers and large distributors, this packaging includes inner plastic and master box only. It reduces costs while still maintaining protection and efficient handling during export."
        />
        <PackagingCard
          type="Loose"
          title="Loose Packaging"
          image="/images/pack-loose.png"
          desc="Ideal for high-volume and cost-sensitive shipments, this option uses only inner plastic (10 kg) packed directly into the master box without inner boxes. It maximizes container space and efficiency, making it the most economical choice."
        />
      </motion.div>
    </section>
  );
}
