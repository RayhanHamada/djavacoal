"use client";

import { NavigationMenuButton } from "@/components/atoms";
import { NAVIGATION_MENUS } from "@/configs";

export function NavigationMenus() {
  return (
    <div className="flex items-center space-x-6 border-1 border-white">
      {NAVIGATION_MENUS.map((menu) => (
        <NavigationMenuButton key={menu.label} {...menu} />
      ))}
    </div>
  );
}
