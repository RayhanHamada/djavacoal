import type { Icon } from "@tabler/icons-react";

export type NavigationChild = {
  label: string;
  icon: Icon;
  href: string;
};

export type NavigationItem = {
  label: string;
  icon: Icon;
  href?: string;
  description?: string;
  children?: NavigationChild[];
};
