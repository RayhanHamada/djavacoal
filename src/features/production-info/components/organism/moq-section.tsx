"use client";
import { motion } from "framer-motion";

export default function MOQSection() {
    return (
        <section id="moq" className="mt-2 scroll-mt-28 rounded-xl bg-[#222222]">
            {/* Header */}
            <header className="mb-4 px-4 pt-4 md:px-6">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        MOQ & Payment Terms
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    Minimum Order & Payment Terms
                </h2>
                <div className="mt-4 h-[1px] bg-[#3A3A3A]" />
            </header>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="px-4 pb-6 md:px-6"
            >
                {/* Subheading */}
                <h3 className="mb-2 text-base font-semibold text-[#EFA12D] md:text-lg">
                    T/T (Telegraph Transfer)
                </h3>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed text-[#CCCCCC] md:text-base">
                    At Djavacoal Indonesia, we keep our business terms simple
                    and transparent to build long-term trust with our partners.
                    We apply a minimum order quantity (MOQ) of one container (20
                    ft or 40 ft), and we accept payments only through T/T
                    (Telegraphic Transfer). These terms ensure smooth
                    processing, secure transactions, and reliable export
                    handling for our global buyers.
                </p>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-[#848484] text-sm md:text-base">
                        <tbody>
                            <tr className="border border-[#848484] bg-[#262626]">
                                <td className="w-44 border border-[#848484] p-3 text-[#FFFFFF] md:w-56 md:p-4">
                                    MOQ:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    20&quot; Container (18 Tons) / 40&quot;
                                    Container (26 Tons)
                                </td>
                            </tr>

                            <tr className="border border-[#848484] bg-[#323232]">
                                <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                    Payment Method:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    T/T (Telegraph Transfer)
                                </td>
                            </tr>

                            <tr className="border border-[#848484] bg-[#262626]">
                                <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                    Payment Structure:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    50% Advance Payment, 50% Balance Before
                                    Shipment (Can Be Discussed)
                                </td>
                            </tr>

                            <tr className="border border-[#848484] bg-[#323232]">
                                <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                    Shipment Terms:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    Freight On Board (FOB)
                                </td>
                            </tr>

                            <tr className="border border-[#848484] bg-[#262626]">
                                <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                    Currency:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    $USD
                                </td>
                            </tr>

                            <tr className="border border-[#848484] bg-[#323232]">
                                <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                    Lead Time:
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    Approx. 4–6 Weeks After Confirmation & Down
                                    Payment
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </section>
    );
}
