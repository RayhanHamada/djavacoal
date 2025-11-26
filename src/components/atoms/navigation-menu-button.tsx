"use client";

import { Suspense, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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

/**
 * Checks if a submenu href matches the current URL (pathname + search params)
 */
function isSubmenuActive(
    href: string,
    pathname: string,
    searchParams: URLSearchParams
): boolean {
    try {
        const url = new URL(href, "http://dummy");
        const hrefPathname = url.pathname;
        const hrefSearchParams = url.searchParams;
        const hrefHash = url.hash;

        if (hrefPathname !== pathname) return false;

        if (hrefHash && hrefSearchParams.size === 0) return false;

        if (hrefSearchParams.size > 0) {
            for (const [key, value] of hrefSearchParams.entries()) {
                if (searchParams.get(key) !== value) return false;
            }
            return true;
        }

        return searchParams.size === 0;
    } catch {
        return false;
    }
}

export function NavigationMenuButton(props: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isPathMatchCurrentButton = props.href && props.href === pathname;

    const [open, setOpen] = useState(false);

    // 🔄 Sinkron antar menu: jika menu lain dibuka, tutup menu ini
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handler = (event: Event) => {
            const e = event as CustomEvent<{ label: string }>;
            // kalau event dari menu lain → tutup menu ini
            if (e.detail?.label !== props.label) {
                setOpen(false);
            }
        };

        window.addEventListener("nav-menu-open", handler);
        return () => window.removeEventListener("nav-menu-open", handler);
    }, [props.label]);

    // 🔄 Close menu when clicking outside
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            // Check if click is outside the menu container
            if (!target.closest("[data-menu-container]")) {
                setOpen(false);
            }
        };

        // Use setTimeout to avoid immediate trigger from the click that opened the menu
        const timeoutId = setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("click", handleClickOutside);
        };
    }, [open]);

    const buttonClass = cn(
        "text-sm lg:text-base text-center",
        "h-full text-white hover:bg-[#B87C22] hover:text-white transition-colors min-w-10 px-2",
        "flex flex-col justify-center hover:cursor-pointer items-center",
        isPathMatchCurrentButton && "text-secondary",
        "md:min-w-20"
    );

    return match(props)
        .with({ href: P.string }, (props) => (
            <Link
                key={props.label}
                href={props.href}
                className={buttonClass}
                onClick={() => {
                    if (typeof window !== "undefined") {
                        window.dispatchEvent(
                            new CustomEvent("nav-menu-open", {
                                detail: { label: "" },
                            })
                        );
                    }
                }}
            >
                {props.label}
            </Link>
        ))
        .with({ submenus: P.nonNullable }, (props) => {
            return (
                <div className="relative h-full border-b-2" data-menu-container>
                    {/* Parent Button (CLICK TOGGLE) */}
                    <button
                        onClick={() => {
                            setOpen((prev) => {
                                const next = !prev;

                                // Kalau sedang dibuka, broadcast ke menu lain supaya mereka close
                                // Use queueMicrotask to defer event dispatch after React commit phase
                                if (!prev && typeof window !== "undefined") {
                                    queueMicrotask(() => {
                                        window.dispatchEvent(
                                            new CustomEvent("nav-menu-open", {
                                                detail: { label: props.label },
                                            })
                                        );
                                    });
                                }

                                return next;
                            });
                        }}
                        className={cn(
                            buttonClass,
                            "flex w-full flex-row items-center gap-1",
                            open && "bg-[#B87C22] text-white"
                        )}
                    >
                        {props.label}
                        <ChevronDown
                            size={16}
                            fill="currentColor"
                            className="pt-1"
                        />
                    </button>

                    {/* Spacer */}
                    <div className="absolute inset-x-0 top-full -z-10 h-1 bg-transparent"></div>

                    {/* Submenu | controlled by `open` */}
                    <div
                        className={cn(
                            "absolute top-full left-0 z-50 mt-0 w-[326px]",
                            "border border-[#353535] bg-[#353535]/90 backdrop-blur-lg",
                            "rounded-b-lg py-2",
                            !open &&
                                "pointer-events-none invisible translate-y-1 scale-y-95 opacity-0",
                            open &&
                                "pointer-events-auto visible translate-y-0 scale-y-100 opacity-100",
                            "transition-all duration-300 ease-out",
                            "[&_a:not(:last-child)]:border-b",
                            "[&_a:not(:last-child)]:border-[#3A3A3A]"
                        )}
                    >
                        {match(props.submenus)
                            .with(P.array(), (submenus) =>
                                submenus.map((submenu) => {
                                    const isActive = isSubmenuActive(
                                        submenu.href ?? "",
                                        pathname,
                                        searchParams
                                    );

                                    return (
                                        <Link
                                            key={submenu.label}
                                            href={submenu.href ?? "#"}
                                            className={cn(
                                                "block px-4 py-2 duration-300 hover:bg-[#3B5952] hover:font-bold",
                                                isActive
                                                    ? "text-secondary font-semibold"
                                                    : "text-white"
                                            )}
                                            onClick={() => setOpen(false)}
                                        >
                                            {submenu.label}
                                        </Link>
                                    );
                                })
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
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
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
