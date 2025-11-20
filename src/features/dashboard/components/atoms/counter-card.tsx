"use client";

import type { DashboardStatCard } from "@/features/dashboard/lib/types";

import Link from "next/link";

import { Group, Paper, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";

type CounterCardProps = DashboardStatCard;

export function CounterCard({
    label,
    count,
    icon: Icon,
    color,
    href,
    loading = false,
}: CounterCardProps) {
    return (
        <Paper
            component={Link}
            href={href}
            p="xl"
            radius="md"
            withBorder
            styles={{
                root: {
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "var(--mantine-shadow-md)",
                    },
                },
            }}
        >
            <Group gap="md" wrap="nowrap">
                <ThemeIcon variant="light" radius="md" size={60} color={color}>
                    <Icon size={32} stroke={1.5} />
                </ThemeIcon>
                <Stack gap={4}>
                    <Text
                        size="sm"
                        c="dimmed"
                        fw={500}
                        tt="uppercase"
                        style={{ letterSpacing: 0.5 }}
                    >
                        {label}
                    </Text>
                    {loading ? (
                        <Skeleton height={40} width={80} />
                    ) : (
                        <Text fz={40} fw={700} lh={1}>
                            {count}
                        </Text>
                    )}
                </Stack>
            </Group>
        </Paper>
    );
}
