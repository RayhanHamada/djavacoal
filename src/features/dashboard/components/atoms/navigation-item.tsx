"use client";

import { NavLink, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import type { NavigationItem } from "@/features/dashboard/lib/types";

type Props = {
  item: NavigationItem;
};

export function NavigationItemComponent({ item }: Props) {
  const Icon = item.icon;

  return (
    <NavLink
      label={item.label}
      description={item.description}
      leftSection={<Icon size={18} stroke={1.7} />}
      component="a"
      href={item.href}
      childrenOffset={rem(14)}
      opened
    >
      {item.children?.map((child) => {
        const CIcon = child.icon;
        return (
          <NavLink
            key={child.label}
            label={child.label}
            component="a"
            href={child.href}
            leftSection={<CIcon size={16} stroke={1.6} />}
            rightSection={<IconChevronRight size={14} stroke={1.4} />}
          />
        );
      })}
    </NavLink>
  );
}
