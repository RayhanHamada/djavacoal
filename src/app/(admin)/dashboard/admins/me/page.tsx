"use client";

import {
    Stack,
    Paper,
    Title,
    Text,
    Group,
    Badge,
    Divider,
    Box,
    Alert,
    Loader,
    Center,
} from "@mantine/core";
import {
    IconUser,
    IconMail,
    IconLock,
    IconAlertCircle,
} from "@tabler/icons-react";

import {
    ChangePasswordForm,
    UpdateNameForm,
} from "@/features/admin-auth/components/molecules";
import { client } from "@/features/admin-auth/lib/better-auth-client";

/**
 * My Profile Page
 * Allows authenticated users to:
 * - View their email and username
 * - Update their name
 * - Change their password with old password verification
 */
export default function MyProfilePage() {
    const { data: session, isPending } = client.useSession();

    if (isPending) {
        return (
            <Center h={400}>
                <Loader size="lg" />
            </Center>
        );
    }

    if (!session?.user) {
        return (
            <Alert
                icon={<IconAlertCircle size={16} />}
                title="Not Authenticated"
                color="red"
            >
                You must be logged in to view this page.
            </Alert>
        );
    }

    const { user } = session;
    const isSuperAdmin = user.role === "admin";

    return (
        <Stack gap="lg">
            {/* Page Header */}
            <div>
                <Title order={2} mb="xs">
                    My Profile
                </Title>
                <Text c="dimmed" size="sm">
                    Manage your personal information and security settings
                </Text>
            </div>

            {/* Profile Information Card */}
            <Paper p="lg" radius="md" withBorder>
                <Stack gap="md">
                    <Group gap="xs">
                        <IconUser size={20} />
                        <Title order={4}>Profile Information</Title>
                    </Group>

                    <Divider />

                    <Box>
                        <Group gap="xs" mb="xs">
                            <IconMail size={16} />
                            <Text size="sm" fw={500}>
                                Email
                            </Text>
                        </Group>
                        <Group gap="xs">
                            <Text size="sm" c="dimmed">
                                {user.email}
                            </Text>
                            {user.emailVerified && (
                                <Badge size="xs" color="green" variant="light">
                                    Verified
                                </Badge>
                            )}
                        </Group>
                    </Box>

                    <Box>
                        <Group gap="xs" mb="xs">
                            <IconUser size={16} />
                            <Text size="sm" fw={500}>
                                Name
                            </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                            {user.name}
                        </Text>
                    </Box>

                    {user.role && (
                        <Box>
                            <Text size="sm" fw={500} mb="xs">
                                Role
                            </Text>
                            <Badge
                                variant="light"
                                color={isSuperAdmin ? "yellow" : "blue"}
                            >
                                {isSuperAdmin ? "Super Admin" : "Admin"}
                            </Badge>
                        </Box>
                    )}
                </Stack>
            </Paper>

            {/* Update Name Form */}
            <Paper p="lg" radius="md" withBorder>
                <Stack gap="md">
                    <div>
                        <Title order={4} mb="xs">
                            Update Name
                        </Title>
                        <Text size="sm" c="dimmed">
                            Change your display name
                        </Text>
                    </div>

                    <Divider />

                    <UpdateNameForm currentName={user.name} />
                </Stack>
            </Paper>

            {/* Change Password Form */}
            <Paper p="lg" radius="md" withBorder>
                <Stack gap="md">
                    <Group gap="xs">
                        <IconLock size={20} />
                        <Title order={4}>Change Password</Title>
                    </Group>

                    <Divider />

                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Security Notice"
                        color="blue"
                        variant="light"
                    >
                        Changing your password will keep you signed in on this
                        device. You won&apos;t be signed out from other devices.
                    </Alert>

                    <ChangePasswordForm />
                </Stack>
            </Paper>
        </Stack>
    );
}
