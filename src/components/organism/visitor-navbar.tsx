"use client";

import { NavigationMenus } from "@/components/molecules";
import { useAppLocale } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function VisitorNavbar({}: Props) {
  const {} = useAppLocale();

  return (
    <nav className="fixed min-h-20 top-0 left-0 w-full bg-black border-b-amber-400 border-2 border-gray-200 flex items-center justify-between px-6 py-4 z-50 opacity-90 backdrop-blur-xl">
      <Link href="/" className="font-semibold text-lg">
        <Image src="/svgs/logo.svg" alt="Logo" width={100} height={40} />
      </Link>
      <NavigationMenus />
    </nav>
  );
}
