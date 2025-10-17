"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    Group,
    Avatar,
    Stack,
    Text,
    Menu,
    UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLogout, IconUser, IconChevronUp } from "@tabler/icons-react";

import { RoleBadge } from "@/features/admin-auth/components/atoms";
import { client } from "@/features/admin-auth/lib/better-auth-client";
import { useCurrentUser } from "@/features/dashboard/hooks";

export function NavigationFooter() {
    const { user, isLoading } = useCurrentUser();
    const router = useRouter();

    async function handleSignOut() {
        try {
            await client.signOut();
            notifications.show({
                message: "Signed out successfully",
                color: "green",
            });
            router.replace("/auth/login");
        } catch {
            notifications.show({
                message: "Failed to sign out",
                color: "red",
            });
        }
    }

    if (isLoading) {
        return (
            <Group p="md" gap="sm">
                <Avatar radius="xl" size="md" />
                <Stack gap={0} style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        Loading...
                    </Text>
                </Stack>
            </Group>
        );
    }

    return (
        <Menu position="top" withArrow offset={8}>
            <Menu.Target>
                <UnstyledButton
                    p="md"
                    style={{
                        width: "100%",
                        borderTop:
                            "1px solid var(--mantine-color-default-border)",
                    }}
                >
                    <Group gap="sm" wrap="nowrap" px="md">
                        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                            <RoleBadge role={user?.role} size="xs" />
                            <Group gap="xs">
                                <Text size="sm" fw={500} truncate>
                                    {user?.name || "User"}
                                </Text>
                            </Group>
                            <Text size="xs" c="dimmed" truncate>
                                {user?.email || "email@example.com"}
                            </Text>
                        </Stack>
                        <IconChevronUp size={16} stroke={1.5} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item leftSection={<IconUser size={16} />}>
                    <Link href="/dashboard/profile">My Profile</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={handleSignOut}
                >
                    Sign Out
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
