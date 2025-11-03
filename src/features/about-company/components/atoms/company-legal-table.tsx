import { COMPANY_LEGAL_DATA } from "../../lib/constants";

export default function CompanyLegalTable() {
    const legalDataRows = [
        { label: "Company Name:", value: COMPANY_LEGAL_DATA.companyName },
        { label: "Owner's Name:", value: COMPANY_LEGAL_DATA.ownerName },
        { label: "Address:", value: COMPANY_LEGAL_DATA.address },
        { label: "Established:", value: COMPANY_LEGAL_DATA.established },
        { label: "Products:", value: COMPANY_LEGAL_DATA.products },
        {
            label: "Production Capacity:",
            value: COMPANY_LEGAL_DATA.productionCapacity,
        },
        { label: "Certification:", value: COMPANY_LEGAL_DATA.certification },
        {
            label: "Registered Number:",
            value: COMPANY_LEGAL_DATA.registeredNumber,
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Legal Data</h3>

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
