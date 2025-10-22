import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    value: string;
    label: string;
}

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
    return (
        <div className="bg-gradient-radial group relative overflow-hidden rounded-[20px] border border-[#4F4F4F] from-[#151515] to-white/5 p-6 text-center backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] md:p-8">
            <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFA12D]/20">
                    <Icon className="h-8 w-8 text-[#EFA12D]" />
                </div>
            </div>
            <h3 className="mb-2 font-['Josefin_Sans'] text-[36px] font-bold text-[#EFA12D] md:text-[42px]">
                {value}
            </h3>
            <p className="font-['Open_Sans'] text-[14px] font-semibold text-white uppercase md:text-[15px]">
                {label}
            </p>
        </div>
    );
}
