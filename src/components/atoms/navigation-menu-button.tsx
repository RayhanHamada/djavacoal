"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { match, P } from "ts-pattern";
import { MergeExclusive } from "type-fest";

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

  const isPathMatchCurrentButton =
    props.href && pathname.includes(props.href ?? "");

  const classNames = cn(
    "text-sm lg:text-base text-center",
    "h-full text-white hover:bg-secondary hover:text-white transition-colors min-w-10  px-2",
    "flex flex-col justify-center hover:cursor-pointer items-center",

    isPathMatchCurrentButton && "text-secondary",

    "md:min-w-20"
  );

  return (
    match(props)
      /**
       * jika ada href, maka render Link
       */
      .with({ href: P.string }, (props) => {
        return (
          <Link
            key={props.label}
            href={props.href}
            className={cn(classNames, "")}
          >
            {props.label}
          </Link>
        );
      })

      /**
       * jika ada submenus, maka render dropdown
       */
      .with({ submenus: P.nonNullable }, (props) => {
        return (
          <div key={props.label} className="relative group h-full">
            <button className={cn(classNames, "flex flex-row items-center")}>
              {props.label}{" "}
              <ChevronDown size={16} fill="currentColor" className="pt-1" />
            </button>
            <div
              className={cn(
                "absolute hidden group-hover:block transition-transform duration-300",
                "bg-[#353535]/90 border left-0 py-2 min-w-[326px] z-10",
                "border-[#353535] backdrop-blur-lg rounded-b-lg"
              )}
            >
              {match(props.submenus)
                /**
                 * jika submenus berupa array, maka render langsung
                 */
                .with(P.array(), (submenus) =>
                  submenus.map((submenu) => (
                    <Link
                      key={submenu.label}
                      href={submenu.href ?? "#"}
                      className="block px-4 py-2 text-white hover:font-bold"
                    >
                      {submenu.label}
                    </Link>
                  ))
                )

                /**
                 * jika submenus berupa function yang mengembalikan Promise,
                 * maka render dengan Suspense
                 */
                .otherwise((submenusPromise) => {
                  const submenus = submenusPromise().catch(() => []);

                  return (
                    <Suspense fallback={<div>Loading...</div>}>
                      {submenus.then((data) =>
                        (data ?? []).map((submenu) => (
                          <Link
                            key={submenu.label}
                            href={submenu.href ?? "#"}
                            className="block px-4 py-2 text-white hover:font-bold text-sm lg:text-base"
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

      .exhaustive()
  );
}
