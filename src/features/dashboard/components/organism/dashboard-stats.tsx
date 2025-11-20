"use client";

import type { DashboardStatCard } from "@/features/dashboard/lib/types";

import { SimpleGrid } from "@mantine/core";

import { CounterCard } from "@/features/dashboard/components/atoms";

type DashboardStatsProps = {
    stats: DashboardStatCard[];
};

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {stats.map((stat) => (
                <CounterCard key={stat.label} {...stat} />
            ))}
        </SimpleGrid>
    );
}
