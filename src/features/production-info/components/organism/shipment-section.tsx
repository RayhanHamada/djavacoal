"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ShipmentSection() {
  return (
    <section id="shipment" className="scroll-mt-28 bg-[#222222] rounded-xl">
      {/* Header */}
      <header className="mb-4 pt-4 px-4 md:px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-[1px] bg-white" />
          <p className="text-sm text-[#60A5FF] font-medium tracking-wide italic">
            Shipment Terms
          </p>
        </div>
        <h2 className="text-white text-xl md:text-2xl font-semibold leading-snug">
          Reliable Shipping with FOB Terms
        </h2>
        <div className="h-[1px] bg-[#3A3A3A] mt-4" />
      </header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="
          flex flex-col items-start gap-6 px-4 pb-6 md:px-6
          md:grid md:grid-cols-[minmax(0,309px)_1fr] md:gap-6
          lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-8
        "
      >
        {/* LEFT: IMAGE */}
        <div
          className="
            relative w-full overflow-hidden rounded-lg
            h-72
            md:aspect-[4/3] md:max-h-[350px]
            lg:aspect-square lg:max-w-[500px] lg:max-h-[500px] lg:h-auto
          "
        >
          <Image
            src="/images/shipment.png"
            alt="Shipment"
            fill
            className="object-cover rounded-lg"
          />

          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/80 to-transparent rounded-t-lg z-10" />

          {/* Watermark logo */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
            <Image
              src="/svgs/logo.svg"
              alt="Djavacoal Watermark"
              width={140}
              height={60}
              className="opacity-80 object-contain"
            />
          </div>
        </div>

        {/* RIGHT: TEXT */}
        <div className="w-full text-[#CCCCCC] text-sm md:text-base leading-relaxed">
          <h3 className="font-semibold text-white mb-2">
            <span>FOB</span>{" "}
            <span className="text-[#EFA12D]">(Freight On Board)</span>
          </h3>

          <p>
            At Djavacoal Indonesia, all international shipments are provided
            under{" "}
            <strong className="text-white font-medium">
              FOB (Free On Board)
            </strong>{" "}
            terms. This means we take full responsibility for{" "}
            <strong className="text-white font-medium">
              preparing, packaging
            </strong>
            , and delivering your order safely to the{" "}
            <strong className="text-white font-medium">
              designated port in Indonesia
            </strong>
            , covering all local costs until the goods are loaded on board the
            vessel. From that point, our buyers have the freedom to arrange
            their preferred shipping line, insurance, and logistics. With access
            to major international ports in Jakarta, Semarang, and Surabaya, we
            ensure smooth, efficient, and cost-effective export handling for our
            global partners.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
