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

      {/* Content: image + text side by side on md */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row items-start lg:items-start gap-6 px-4 pb-6 md:px-6"
      >
        {/* Left: Image with watermark */}
        <div className="relative w-full md:w-1/2 overflow-hidden rounded-lg">
          <Image
            src="/images/shipment.png"
            alt="Shipment"
            width={1000}
            height={600}
            className="object-cover w-full h-72 lg:h-[36rem] rounded-lg"
          />

          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/80 to-transparent rounded-t-lg z-10" />
          {/* Watermark logo (center top) */}
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

        {/* Right: Text content */}
        <div className="w-full md:w-1/2 text-[#CCCCCC] text-sm md:text-base leading-relaxed">
          <h3 className="text-[#EFA12D] font-semibold mb-2">
            FOB (Freight On Board)
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
