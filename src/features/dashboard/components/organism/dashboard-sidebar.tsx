"use client";

import { AppShellNavbar, Divider } from "@mantine/core";
import {
  NavigationList,
  NavigationFooter,
} from "@/features/dashboard/components/molecules";
import { navigationConfig } from "@/features/dashboard/lib";

export function DashboardSidebar() {
  return (
    <AppShellNavbar p={0}>
      <NavigationList items={navigationConfig} />
      <Divider />
      <NavigationFooter />
    </AppShellNavbar>
  );
}
