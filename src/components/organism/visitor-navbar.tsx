"use client";

import { PropsWithChildren } from "react";

import Image from "next/image";
import Link from "next/link";

import { NavigationMenus } from "@/components/molecules";
import { LanguageSwitch } from "@/components/molecules/language-switch";
import { useAppLocale } from "@/hooks";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren;

export default function VisitorNavbar(_: Props) {
    const __ = useAppLocale();

    return (
        <nav className="bg-primary border-b-secondary fixed z-50 flex min-h-24 w-full items-center justify-between opacity-90 backdrop-blur-xl">
            <Link href="/" className="px-6 py-2 text-lg font-semibold">
                <Image
                    className="h-auto w-34"
                    src="/svgs/logo.svg"
                    alt="Logo"
                    width={100}
                    height={80}
                />
            </Link>
            <div className={cn("hidden h-20", "md:block")}>
                <NavigationMenus />
            </div>
            <div className={cn("hidden px-6 py-4", "md:block")}>
                <LanguageSwitch />
            </div>
        </nav>
    );
}
