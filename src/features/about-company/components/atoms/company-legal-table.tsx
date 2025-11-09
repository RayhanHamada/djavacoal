"use client";

import { useTranslations } from "next-intl";

import { COMPANY_LEGAL_DATA } from "../../lib/constants";

export default function CompanyLegalTable() {
    const t = useTranslations("AboutCompany.companyLegal");

    const legalDataRows = [
        { label: t("companyName"), value: COMPANY_LEGAL_DATA.companyName },
        { label: t("ownerName"), value: COMPANY_LEGAL_DATA.ownerName },
        { label: t("address"), value: COMPANY_LEGAL_DATA.address },
        { label: t("established"), value: COMPANY_LEGAL_DATA.established },
        { label: t("products"), value: COMPANY_LEGAL_DATA.products },
        {
            label: t("productionCapacity"),
            value: COMPANY_LEGAL_DATA.productionCapacity,
        },
        { label: t("certification"), value: COMPANY_LEGAL_DATA.certification },
        {
            label: t("registeredNumber"),
            value: COMPANY_LEGAL_DATA.registeredNumber,
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("title")}</h3>

            <div className="overflow-hidden rounded-md border border-[#2A2A2A] text-sm">
                <table className="w-full border-collapse border border-[#848484] text-sm md:text-base">
                    <tbody>
                        {legalDataRows.map((row, index) => (
                            <tr
                                key={index}
                                className={`border border-[#848484] ${
                                    index % 2 === 0
                                        ? "bg-[#3A3A3A]"
                                        : "bg-[#262626]"
                                }`}
                            >
                                <td className="w-44 border border-[#848484] p-3 font-semibold text-[#FFFFFF] md:w-56 md:p-4">
                                    {row.label}
                                </td>
                                <td className="border border-[#848484] p-3 text-[#CCCCCC] md:p-4">
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
