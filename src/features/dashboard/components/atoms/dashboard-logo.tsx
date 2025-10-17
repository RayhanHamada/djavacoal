"use client";

import { ThemeIcon } from "@mantine/core";
import { IconLayoutDashboard } from "@tabler/icons-react";

export function DashboardLogo() {
  return (
    <ThemeIcon
      size="lg"
      radius="md"
      variant="gradient"
      gradient={{ from: "indigo", to: "cyan" }}
    >
      <IconLayoutDashboard size={20} stroke={1.8} />
    </ThemeIcon>
  );
}
