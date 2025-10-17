"use client";

import { useCallback } from "react";

import { Modal, Stack, TextInput, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import {
    InviteAdminFormValues,
    validateInviteAdminForm,
} from "@/features/admin-auth/lib/form-schema";

type Props = {
    opened: boolean;
    onClose: () => void;
    onInvite: (values: InviteAdminFormValues) => void | Promise<void>;
    isLoading?: boolean;
};

/**
 * Extracts the username from an email address
 * e.g., "abc@gmail.com" -> "abc"
 */
function extractNameFromEmail(email: string): string {
    const match = email.match(/^([^@]+)@/);
    return match ? match[1] : "";
}

export function InviteAdminModal({
    opened,
    onClose,
    onInvite,
    isLoading,
}: Props) {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            name: "",
        },
        validate: validateInviteAdminForm,
    });

    const handleEmailChange = useCallback(
        (email: string) => {
            // Auto-populate name from email if name is empty
            const currentName = form.getValues().name;
            if (
                !currentName ||
                currentName === extractNameFromEmail(form.getValues().email)
            ) {
                const extractedName = extractNameFromEmail(email);
                form.setFieldValue("name", extractedName);
            }
        },
        [form]
    );

    form.watch("email", function ({ value }) {
        handleEmailChange(value);
    });

    const handleSubmit = form.onSubmit(async function (values) {
        await onInvite(values);
        form.reset();
    });

    function handleClose() {
        if (!isLoading) {
            form.reset();
            onClose();
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Invite New Admin"
            centered
            closeOnClickOutside={!isLoading}
            closeOnEscape={!isLoading}
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Send an invitation email to a new admin. They will
                        receive a link to set up their account.
                    </Text>

                    <TextInput
                        label="Email"
                        placeholder="admin@example.com"
                        required
                        type="email"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                        disabled={isLoading}
                    />

                    <TextInput
                        label="Name"
                        placeholder="John Doe"
                        required
                        key={form.key("name")}
                        {...form.getInputProps("name")}
                        disabled={isLoading}
                        description="Auto-filled from email, but you can change it"
                    />

                    <Button type="submit" fullWidth loading={isLoading} mt="md">
                        Send Invitation
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}
