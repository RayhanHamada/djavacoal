"use client";

import Link from "next/link";

import {
    Stack,
    Text,
    Paper,
    SimpleGrid,
    ThemeIcon,
    Group,
    Title,
    Skeleton,
} from "@mantine/core";
import {
    IconArticle,
    IconBrandProducthunt,
    IconPackage,
    IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/features/dashboard-auth/lib/better-auth-client";
import { rpc } from "@/lib/rpc";

// Component: Counter card
interface CounterCardProps {
    label: string;
    count: number;
    icon: React.ComponentType<{ size?: number; stroke?: number }>;
    tone: string;
    href: string;
    loading?: boolean;
}

function CounterCard({
    label,
    count,
    icon: Icon,
    tone,
    href,
    loading,
}: CounterCardProps) {
    return (
        <Paper
            href={href}
            component={Link}
            p="xl"
            radius="md"
            withBorder
            style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
            }}
        >
            <Group gap="md" wrap="nowrap">
                <ThemeIcon
                    variant="light"
                    radius="md"
                    size={60}
                    color={tone as any}
                >
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

export default function Page() {
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

    return (
        <Stack gap="xl" maw={1200} mx="auto">
            {/* Welcome Section */}
            <Stack gap="xs">
                <Title order={1}>
                    Welcome to Dashboard, <b>{session?.user?.name ?? "User"}</b>
                </Title>
                <Text c="dimmed" size="lg">
                    Overview of your content
                </Text>
            </Stack>

            {/* Counter Grid */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <CounterCard
                    label="Articles"
                    count={newsCount?.count ?? 0}
                    icon={IconArticle}
                    tone="grape"
                    href={"/dashboard/news"}
                    loading={newsLoading}
                />
                <CounterCard
                    label="Products"
                    count={productCount?.count ?? 0}
                    icon={IconBrandProducthunt}
                    tone="teal"
                    href={"/dashboard/products"}
                    loading={productLoading}
                />
                <CounterCard
                    label="Packaging Options"
                    count={packagingCount?.count ?? 0}
                    icon={IconPackage}
                    tone="orange"
                    href={"/dashboard/products/packaging-options"}
                    loading={packagingLoading}
                />
                <CounterCard
                    label="Team Members"
                    count={teamCount?.count ?? 0}
                    icon={IconUsers}
                    tone="blue"
                    href={"/dashboard/page-settings/team-members"}
                    loading={teamLoading}
                />
            </SimpleGrid>
        </Stack>
    );
}
