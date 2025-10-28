"use client";

import { useState } from "react";

import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface RenameModalProps {
    opened: boolean;
    onClose: () => void;
    photo: { id: string; name: string } | null;
    onSuccess: () => void;
}

/**
 * Modal for renaming a photo
 */
export function RenameModal({
    opened,
    onClose,
    photo,
    onSuccess,
}: RenameModalProps) {
    const [newName, setNewName] = useState(photo?.name || "");
    const [error, setError] = useState<string | undefined>();

    const renameMutation = useMutation({
        mutationFn: async () => {
            if (!photo) throw new Error("No photo selected");
            return client.gallery.renamePhoto({
                id: photo.id,
                newName,
            });
        },
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: "Photo renamed successfully",
                color: "green",
            });
            onSuccess();
            onClose();
        },
        onError: (err) => {
            notifications.show({
                title: "Rename Failed",
                message:
                    err instanceof Error ? err.message : "An error occurred",
                color: "red",
            });
        },
    });

    const handleRename = async () => {
        if (newName.length < 8 || newName.length > 100) {
            setError("Name must be 8-100 characters");
            return;
        }
        await renameMutation.mutateAsync();
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Rename Photo" size="md">
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    Enter a new name for this photo (8-100 characters)
                </Text>

                <TextInput
                    label="New Name"
                    placeholder="Enter new photo name"
                    value={newName}
                    onChange={(event) => {
                        setNewName(event.currentTarget.value);
                        setError(undefined);
                    }}
                    error={error}
                    required
                />

                <Group justify="flex-end" gap="sm">
                    <Button
                        variant="subtle"
                        onClick={onClose}
                        disabled={renameMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRename}
                        loading={renameMutation.isPending}
                    >
                        Rename
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
