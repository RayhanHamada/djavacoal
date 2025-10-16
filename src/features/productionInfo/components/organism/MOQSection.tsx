"use client";
import { motion } from "framer-motion";

export default function MOQSection() {
  return (
    <section id="moq" className="scroll-mt-28 mt-2 bg-[#222222] rounded-xl">
      {/* Header */}
      <header className="mb-4 pt-4 px-4 md:px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-[1px] bg-white" />
          <p className="text-sm text-[#60A5FF] font-medium tracking-wide italic">
            MOQ & Payment Terms
          </p>
        </div>
        <h2 className="text-white text-xl md:text-2xl font-semibold leading-snug">
          Minimum Order & Payment Terms
        </h2>
        <div className="h-[1px] bg-[#3A3A3A] mt-4" />
      </header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="px-4 md:px-6 pb-6"
      >
        {/* Subheading */}
        <h3 className="text-[#EFA12D] font-semibold text-base md:text-lg mb-2">
          T/T (Telegraph Transfer)
        </h3>

        {/* Description */}
        <p className="text-[#CCCCCC] text-sm md:text-base leading-relaxed mb-6">
          At Djavacoal Indonesia, we keep our business terms simple and
          transparent to build long-term trust with our partners. We apply a
          minimum order quantity (MOQ) of one container (20 ft or 40 ft), and we
          accept payments only through T/T (Telegraphic Transfer). These terms
          ensure smooth processing, secure transactions, and reliable export
          handling for our global buyers.
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base border border-[#848484] border-collapse">
            <tbody>
              <tr className="bg-[#262626] border border-[#848484]">
                <td className="p-3 md:p-4 text-[#FFFFFF] w-44 md:w-56 border border-[#848484]">
                  MOQ:
                </td>
                <td className="p-3 md:p-4 text-[#CCCCCC] border border-[#848484]">
                  20&quot; Container (18 Tons) / 40&quot; Container (26 Tons)
                </td>
              </tr>

              <tr className="bg-[#323232] border border-[#848484]">
                <td className="p-3 md:p-4 text-[#FFFFFF] border border-[#848484]">
                  Payment Method:
                </td>
                <td className="p-3 md:p-4 text-[#CCCCCC] border border-[#848484]">
                  T/T (Telegraph Transfer)
                </td>
              </tr>

              <tr className="bg-[#262626] border border-[#848484]">
                <td className="p-3 md:p-4 text-[#FFFFFF] border border-[#848484]">
                  Payment Structure:
                </td>
                <td className="p-3 md:p-4 text-[#CCCCCC] border border-[#848484]">
                  50% Advance Payment, 50% Balance Before Shipment (Can Be
                  Discussed)
                </td>
              </tr>

              <tr className="bg-[#323232] border border-[#848484]">
                <td className="p-3 md:p-4 text-[#FFFFFF] border border-[#848484]">
                  Shipment Terms:
                </td>
                <td className="p-3 md:p-4 text-[#CCCCCC] border border-[#848484]">
                  Freight On Board (FOB)
                </td>
              </tr>

              <tr className="bg-[#262626] border border-[#848484]">
                <td className="p-3 md:p-4 text-[#FFFFFF] border border-[#848484]">
                  Currency:
                </td>
                <td className="p-3 md:p-4 text-[#CCCCCC] border border-[#848484]">
                  $USD
                </td>
              </tr>

              <tr className="bg-[#323232] border border-[#848484]">
                <td className="p-3 md:p-4 text-[#FFFFFF] border border-[#848484]">
                  Lead Time:
                </td>
                <td className="p-3 md:p-4 text-[#CCCCCC] border border-[#848484]">
                  Approx. 4–6 Weeks After Confirmation & Down Payment
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
