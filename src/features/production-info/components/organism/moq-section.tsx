"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function MOQSection() {
    const t = useTranslations("ProductionInfo.moq");

    return (
        <section id="moq" className="mt-2 scroll-mt-28 rounded-xl bg-[#222222]">
            {/* Header */}
            <header className="mb-4 px-4 pt-4 md:px-6">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        {t("subtitle")}
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    {t("title")}
                </h2>
                <div className="mt-4 h-px bg-[#3A3A3A]" />
            </header>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="px-4 pb-6 md:px-6 lg:px-0"
            >
                {/* === BAGIAN GRID === */}
                <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 lg:px-6">
                    {/* === KIRI: Deskripsi === */}
                    <div>
                        <h3 className="mb-2 text-base font-semibold md:text-lg">
                            <span className="text-white">
                                {t("methodTitle")}
                            </span>{" "}
                            <span className="text-[#EFA12D]">
                                {t("methodSubtitle")}
                            </span>
                        </h3>

                        <p className="mb-6 text-sm leading-relaxed text-[#CCCCCC] md:text-base">
                            {t("description")}
                        </p>
                    </div>

                    {/* === KANAN: Tabel === */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-[#848484] text-sm md:text-base">
                            <tbody>
                                <tr className="border border-[#848484] bg-[#262626]">
                                    <td className="w-44 border border-[#848484] p-3 text-[#FFFFFF] md:w-56 md:p-4">
                                        {t("table.moq.label")}
                                    </td>
                                    <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                        {t("table.moq.value")}
                                    </td>
                                </tr>

                                <tr className="border border-[#848484] bg-[#323232]">
                                    <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                        {t("table.paymentMethod.label")}
                                    </td>
                                    <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                        {t("table.paymentMethod.value")}
                                    </td>
                                </tr>

                                <tr className="border border-[#848484] bg-[#262626]">
                                    <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                        {t("table.paymentStructure.label")}
                                    </td>
                                    <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                        {t("table.paymentStructure.value")}
                                    </td>
                                </tr>

                                <tr className="border border-[#848484] bg-[#323232]">
                                    <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                        {t("table.shipmentTerms.label")}
                                    </td>
                                    <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                        {t("table.shipmentTerms.value")}
                                    </td>
                                </tr>

                                <tr className="border border-[#848484] bg-[#262626]">
                                    <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                        {t("table.currency.label")}
                                    </td>
                                    <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                        {t("table.currency.value")}
                                    </td>
                                </tr>

                                <tr className="border border-[#848484] bg-[#323232]">
                                    <td className="border border-[#848484] p-3 text-[#FFFFFF] md:p-4">
                                        {t("table.leadTime.label")}
                                    </td>
                                    <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                        {t("table.leadTime.value")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
