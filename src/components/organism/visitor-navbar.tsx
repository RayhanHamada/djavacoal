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
        <nav className="bg-primary border-b-secondary bg-primary/90 fixed z-100 flex min-h-24 w-full items-center justify-between backdrop-blur-xl">
            <Link
                href="/"
                className="px-6 py-2 text-lg font-semibold lg:ml-[50px]"
            >
                <Image
                    className="h-auto w-34"
                    src="/svgs/logo.svg"
                    alt="Logo"
                    width={100}
                    height={80}
                />
            </Link>
            <div className={cn("hidden h-20", "lg:block")}>
                <NavigationMenus />
            </div>
            <div className={cn("hidden px-6 py-4", "lg:block", "lg:mr-[50px]")}>
                <LanguageSwitch />
            </div>
            {/* Garis bawah oranye */}
            <div className="bg-secondary absolute bottom-0 left-0 h-[2px] w-full"></div>
        </nav>
    );
}
