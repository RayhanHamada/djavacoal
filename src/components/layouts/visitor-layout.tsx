import { PropsWithChildren } from "react";

import { VisitorFooter, VisitorNavbar } from "@/components/organism";

type Props = PropsWithChildren;

export default function VisitorLayout({ children }: Props) {
    return (
        <div className="flex min-h-screen flex-col bg-[#151515]">
            <VisitorNavbar />

            {/* main contents */}
            <main className="flex w-full flex-col pt-24">{children}</main>

            {/* spacer */}
            <div className="flex-1" />

            {/* footer */}
            <VisitorFooter />
        </div>
    );
}
