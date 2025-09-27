import { VisitorFooter, VisitorNavbar } from "@/components/organism";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function VisitorLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <VisitorNavbar />

      {/* main contents */}
      <main className="pt-23 w-full flex flex-col">{children}</main>

      {/* spacer */}
      <div className="flex-1" />

      {/* footer */}
      <VisitorFooter />
    </div>
  );
}
