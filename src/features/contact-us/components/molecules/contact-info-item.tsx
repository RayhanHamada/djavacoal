import { useLocale } from "next-intl";

import { LOCALES } from "@/configs";

interface ContactInfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    disableRtl?: boolean;
}

export function ContactInfoItem({
    icon,
    label,
    value,
    disableRtl = false,
}: ContactInfoItemProps) {
    const locale = useLocale();
    return (
        <div>
            <div className="flex-col-2 mb-2 flex items-start gap-3">
                {/* Icon */}
                <div className="text-secondary mt-1 shrink-0 text-xl">
                    {icon}
                </div>

                {/* Label + Value */}
                <div className="flex flex-col">
                    <p className="text-secondary font-semibold">{label}</p>
                </div>
            </div>
            <div
                dir={disableRtl ? "ltr" : undefined}
                className={
                    disableRtl && locale === LOCALES.AR ? "text-right" : ""
                }
            >
                <p className="text-sm leading-snug text-gray-300">{value}</p>
            </div>
        </div>
    );
}
