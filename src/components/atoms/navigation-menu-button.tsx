import { MenuItems } from "@/configs";
import Link from "next/link";

type Props = MenuItems;

export function NavigationMenuButton(props: Props) {
  if (props.submenus) {
    return (
      <div key={props.label} className="relative group">
        <button className="text-white hover:text-amber-400 transition-colors">
          {props.label}
        </button>
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black border border-gray-200 mt-2 py-2 w-48 z-10">
          {props.submenus.map((submenu) => (
            <Link
              key={submenu.label}
              href={submenu.href ?? "#"}
              className="block px-4 py-2 text-white hover:bg-gray-700"
            >
              {submenu.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      key={props.label}
      href={props.href ?? "#"}
      className="text-white hover:text-amber-400 transition-colors"
    >
      {props.label}
    </Link>
  );
}
