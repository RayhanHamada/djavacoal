"use client";

import {
    Stack,
    Box,
    Text,
    Paper,
    SimpleGrid,
    ThemeIcon,
    Divider,
    Group,
    rem,
} from "@mantine/core";
import { IconArticle, IconBrandProducthunt } from "@tabler/icons-react";

// Dashboard stats data
const stats = [
    { label: "Articles", value: "342", icon: IconArticle, tone: "grape" },
    {
        label: "Products",
        value: "4",
        icon: IconBrandProducthunt,
        tone: "teal",
    },
];

// Component: Stats grid
function StatsSection() {
    return (
        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb="lg">
            {stats.map((s) => {
                const Icon = s.icon;
                return (
                    <Paper
                        key={s.label}
                        p="md"
                        radius="md"
                        withBorder
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: rem(6),
                        }}
                    >
                        <Group gap="xs">
                            <ThemeIcon
                                variant="light"
                                radius="md"
                                size="lg"
                                color={s.tone as any}
                            >
                                <Icon size={18} stroke={1.7} />
                            </ThemeIcon>
                            <Text
                                size="xs"
                                c="dimmed"
                                fw={500}
                                tt="uppercase"
                                style={{ letterSpacing: 0.5 }}
                            >
                                {s.label}
                            </Text>
                        </Group>
                        <Text fz={28} fw={600} lh={1.1}>
                            {s.value}
                        </Text>
                        <Divider variant="dashed" />
                    </Paper>
                );
            })}
        </SimpleGrid>
    );
}

export default function Page() {
    return (
        <Stack gap="xl">
            <StatsSection />
            <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
                <Box style={{ gridColumn: "span 2" }}></Box>
            </SimpleGrid>
        </Stack>
    );
}
