"use client";

import { NavigationMenuButton } from "@/components/atoms";
import { useMenuItems } from "@/hooks";

export function NavigationMenus() {
    const menuItems = useMenuItems();

    return (
        <div className="flex h-full items-center gap-x-4 self-stretch">
            {menuItems.map((item, index) => {
                // NavigationMenuButton expects either href OR submenus, not both
                if (item.submenus) {
                    return (
                        <NavigationMenuButton
                            key={`menu-${index}`}
                            label={item.label}
                            submenus={item.submenus}
                        />
                    );
                }
                return (
                    <NavigationMenuButton
                        key={item.href || `menu-${index}`}
                        label={item.label}
                        href={item.href!}
                    />
                );
            })}
        </div>
    );
}
