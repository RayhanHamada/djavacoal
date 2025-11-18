"use client";

import { Suspense } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown } from "lucide-react";
import { match, P } from "ts-pattern";
import { MergeExclusive } from "type-fest";

import { cn } from "@/lib/utils";

export type MenuItems = {
    label: string;
} & MergeExclusive<
    { href: string },
    {
        submenus:
            | Exclude<MenuItems, "submenus">[]
            | (() => Promise<Exclude<MenuItems, "submenus">[]>);
    }
>;

type Props = MenuItems;

export function NavigationMenuButton(props: Props) {
    const pathname = usePathname();
    const isPathMatchCurrentButton = props.href && props.href === pathname;

    const buttonClass = cn(
        "text-sm lg:text-base text-center",
        "h-full text-white hover:bg-secondary hover:text-white transition-colors min-w-10 px-2",
        "flex flex-col justify-center hover:cursor-pointer items-center",
        isPathMatchCurrentButton && "text-secondary",
        "md:min-w-20"
    );

    return match(props)
        .with({ href: P.string }, (props) => (
            <Link key={props.label} href={props.href} className={buttonClass}>
                {props.label}
            </Link>
        ))
        .with({ submenus: P.nonNullable }, (props) => {
            return (
                <div className="group relative h-full border-b-2">
                    {/* Parent Button */}
                    <button
                        className={cn(
                            buttonClass,
                            "flex w-full flex-row items-center gap-1"
                        )}
                    >
                        {props.label}
                        <ChevronDown
                            size={16}
                            fill="currentColor"
                            className="pt-1"
                        />
                    </button>

                    <div className="absolute inset-x-0 top-full -z-10 h-1 bg-transparent"></div>

                    {/* Submenu - appears on group hover */}
                    <div
                        className={cn(
                            "absolute top-full left-0 z-50 mt-0 w-[326px]",
                            "border border-[#353535] bg-[#353535]/90 backdrop-blur-lg",
                            "rounded-b-lg py-2",
                            "invisible translate-y-1 scale-y-95 opacity-0",
                            "group-hover:visible group-hover:translate-y-0 group-hover:scale-y-100 group-hover:opacity-100",
                            "transition-all duration-300 ease-out",
                            "pointer-events-none group-hover:pointer-events-auto",
                            "[&_a:not(:last-child)]:border-b",
                            "[&_a:not(:last-child)]:border-[#3A3A3A]"
                        )}
                    >
                        {match(props.submenus)
                            .with(P.array(), (submenus) =>
                                submenus.map((submenu) => (
                                    <Link
                                        key={submenu.label}
                                        href={submenu.href ?? "#"}
                                        className="block px-4 py-2 text-white duration-300 hover:bg-[#3B5952] hover:font-bold"
                                    >
                                        {submenu.label}
                                    </Link>
                                ))
                            )
                            .otherwise((submenusPromise) => {
                                const submenus = submenusPromise().catch(
                                    () => []
                                );
                                return (
                                    <Suspense
                                        fallback={
                                            <div className="px-4 py-2">
                                                Loading...
                                            </div>
                                        }
                                    >
                                        {submenus.then((data) =>
                                            data.map((submenu) => (
                                                <Link
                                                    key={submenu.label}
                                                    href={submenu.href ?? "#"}
                                                    className="block px-4 py-2 text-sm text-white hover:font-bold lg:text-base"
                                                >
                                                    {submenu.label}
                                                </Link>
                                            ))
                                        )}
                                    </Suspense>
                                );
                            })}
                    </div>
                </div>
            );
        })
        .exhaustive();
}
