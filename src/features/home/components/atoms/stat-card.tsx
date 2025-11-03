"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    value: string;
    label: string;
}

export default function StatCard({ icon: Icon, value, label }: StatCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-[18px] border border-[#3A3A3A] bg-[#2A2A2A80] p-6 text-center backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] hover:bg-[#2A2A2ACC] md:p-8">
            {/* Icon Circle */}
            <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFA12D]/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7 text-[#EFA12D]" />
                </div>
            </div>

            {/* Number */}
            <h3 className="mb-2 font-['Josefin_Sans'] text-[32px] font-bold text-[#EFA12D] md:text-[38px]">
                {value}
            </h3>

            {/* Label */}
            <p className="font-['Open_Sans'] text-[13px] text-[#CFCFCF] uppercase md:text-[14px]">
                {label}
            </p>
        </div>
    );
}
