"use client";

import { Group, Box, Title, Text } from "@mantine/core";
import { DashboardLogo } from "@/features/dashboard/components/atoms";

export function DashboardHeader() {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group gap="xs">
        <DashboardLogo />
        <Box>
          <Title order={4} fw={600}>
            Djavacoal Admin
          </Title>
          <Text size="xs" c="dimmed">
            Content Management System
          </Text>
        </Box>
      </Group>
    </Group>
  );
}
