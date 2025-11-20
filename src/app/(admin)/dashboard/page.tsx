"use client";

import type { DashboardStatCard } from "@/features/dashboard/lib/types";

import { Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { WelcomeHeader } from "@/features/dashboard/components/molecules/welcome-header";
import { DashboardStats } from "@/features/dashboard/components/organism/dashboard-stats";
import { DASHBOARD_STATS_CONFIG } from "@/features/dashboard/lib/constants";
import { client } from "@/features/dashboard-auth/lib/better-auth-client";
import { rpc } from "@/lib/rpc";

export default function DashboardPage() {
    const { data: session } = client.useSession();

    // Fetch counts using RPC
    const { data: newsCount, isLoading: newsLoading } = useQuery(
        rpc.dashboardNews.getNewsCount.queryOptions()
    );
    const { data: productCount, isLoading: productLoading } = useQuery(
        rpc.dashboardProduct.getProductCount.queryOptions()
    );
    const { data: packagingCount, isLoading: packagingLoading } = useQuery(
        rpc.dashboardProduct.getPackagingOptionCount.queryOptions()
    );
    const { data: teamCount, isLoading: teamLoading } = useQuery(
        rpc.dashboardTeamMember.getTeamMemberCount.queryOptions()
    );

    // Map configuration to stats with counts
    const stats: DashboardStatCard[] = DASHBOARD_STATS_CONFIG.map(
        (config, index) => {
            const countData = [
                newsCount,
                productCount,
                packagingCount,
                teamCount,
            ][index];
            const loading = [
                newsLoading,
                productLoading,
                packagingLoading,
                teamLoading,
            ][index];

            return {
                ...config,
                count: countData?.count ?? 0,
                loading,
            };
        }
    );

    return (
        <Stack gap="xl" maw={1200} mx="auto">
            <WelcomeHeader userName={session?.user?.name} />
            <DashboardStats stats={stats} />
        </Stack>
    );
}
