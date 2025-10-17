"use client";

import { NavigationMenus } from "@/components/molecules";
import { LanguageSwitch } from "@/components/molecules/language-switch";
import { useAppLocale } from "@/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function VisitorNavbar({}: Props) {
  const {} = useAppLocale();

  return (
    <nav className="fixed min-h-24 w-full bg-primary border-b-secondary flex items-center justify-between z-50 opacity-90 backdrop-blur-xl">
      <Link href="/" className="font-semibold text-lg px-6 py-2">
        <Image
          className="w-34 h-auto"
          src="/svgs/logo.svg"
          alt="Logo"
          width={100}
          height={80}
        />
      </Link>
      <div className={cn("hidden h-20", "md:block")}>
        <NavigationMenus />
      </div>
      <div className={cn("px-6 py-4 hidden", "md:block")}>
        <LanguageSwitch />
      </div>
      {/* Garis bawah oranye */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary"></div>
    </nav>
  );
}
