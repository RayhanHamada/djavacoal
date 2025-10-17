"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface StepCardProps {
  image: string;
  title: string;
  description: string;
}

function StepCard({ image, title, description }: StepCardProps) {
  return (
    <div className="bg-[#222222] rounded-xl  flex flex-col justify-start transition-transform duration-300 hover:-translate-y-1">
      {/* Gambar dengan watermark di tengah atas + gradasi hitam tipis */}
      <div className="relative w-full overflow-hidden rounded-xl mb-4">
        {/* Gambar utama */}
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-auto object-cover rounded-xl"
        />

        {/* Gradasi hitam tipis di bagian atas */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/70 to-transparent rounded-t-xl z-10" />

        {/* Logo watermark di tengah atas */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <Image
            src="/svgs/logo.svg"
            alt="Djavacoal Watermark"
            width={130}
            height={60}
            className="opacity-85 object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>

      {/* Konten teks */}
      <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
      <p className="text-[#CCCCCC] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function ProcessSection() {
  const [isMd, setIsMd] = useState(false);

  // Deteksi ukuran layar real-time
  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const steps = [
    {
      image: "/images/Step1.png",
      title: "1. Raw Material Selection:",
      description:
        "We use only selected, high-quality coconut shells that are clean and fully matured. All materials are carefully inspected to ensure high fixed carbon, low ash, and consistent performance.We select mature, high-density coconut shells from trusted sources for consistent performance and long burn time.",
    },
    {
      image: "/images/Step2.png",
      title: "2. Carbonization (Shell to Charcoal):",
      description:
        "The shells are burned in controlled, low-oxygen kilns to produce charcoal. This process is carefully monitored to achieve the right balance of fixed carbon (≈80%) and ash content (≤2%).",
    },
    {
      image: "/images/Step3.png",
      title: "3. Crushing & Sieving:",
      description:
        "The charcoal is crushed into powder and sieved into a fine, uniform particle size. This ensures consistency in mixing and results in dense, evenly burning briquettes.",
    },
    {
      image: "/images/Step4.png",
      title: "4. Mixing with Natural Binder:",
      description:
        "The charcoal powder is blended with a food-grade natural binder (commonly tapioca starch) and water. No chemicals are added, ensuring the product is safe, odorless, and tasteless when used for shisha.",
    },
    {
      image: "/images/Step5.png",
      title: "5. Briquetting / Molding:",
      description:
        "The mixture is pressed under high pressure into cubic shapes (e.g., 25×25×25 mm, 26×26×26 mm, or custom sizes). The high density allows for longer burn time and consistent heat release.",
    },
    {
      image: "/images/Step6.png",
      title: "6. Drying & Curing:",
      description:
        "The freshly pressed briquettes are dried in ovens or under controlled conditions until moisture levels drop below 5%. Proper drying prevents cracking and ensures durability during transport.",
    },
    {
      image: "/images/Step7.png",
      title: "7. Quality Control & Lab Testing:",
      description:
        "Each batch is tested for ash content, moisture, volatile matter, fixed carbon, calorific value, and burning duration. Briquettes must pass the standards.",
    },
    {
      image: "/images/Step8.png",
      title: "8. Packaging Process:",
      description:
        "Briquettes are sealed in inner plastic bags to protect against moisture, then placed in branded or OEM master boxes. Packaging options can be customized for shisha brands worldwide.",
    },
    {
      image: "/images/Step9.png",
      title: "9. Storage & Export:",
      description:
        "Finished products are stored in a clean, dry warehouse before being shipped via international ports in Jakarta, Semarang, or Surabaya. Export documents and Certificates of Analysis (COA) are provided for transparency.",
    },
  ];

  const itemsPerRow = isMd ? 3 : 2;
  const rows = Array.from({ length: Math.ceil(steps.length / itemsPerRow) });

  return (
    <section id="process" className="scroll-mt-28 bg-[#222222] rounded-xl">
      {/* Header */}
      <header className="mb-2 pt-4">
        <div className="flex items-center gap-3 mb-2 px-6">
          <div className="w-8 h-[1px] bg-white" />
          <p className="text-sm text-[#60A5FF] font-medium tracking-wide italic">
            Production Process
          </p>
        </div>
        <h2 className="text-white text-xl md:text-2xl font-semibold leading-snug px-6">
          How We Craft Quality Charcoal for Global Markets
        </h2>
        <div className="h-[1px] bg-[#3A3A3A] mt-4" />
      </header>

      {/* Grid adaptif */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        {rows.map((_, rowIndex) => {
          const start = rowIndex * itemsPerRow;
          const group = steps.slice(start, start + itemsPerRow);

          return (
            <div
              key={rowIndex}
              className={`grid grid-cols-2 md:grid-cols-3 gap-3 py-6 px-6 ${
                rowIndex !== rows.length - 1 ? "border-b border-[#3A3A3A]" : ""
              }`}
            >
              {group.map((step, index) => (
                <StepCard
                  key={index}
                  image={step.image}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
