"use client";

import { useEffect, useState } from "react";

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
    const [newName, setNewName] = useState(photo?.name ?? "");
    const [error, setError] = useState<string | undefined>();

    // Reset name when photo changes
    useEffect(() => {
        setNewName(photo?.name ?? "");
        setError(undefined);
    }, [photo?.name]);

    const renameMutation = useMutation({
        mutationFn: async () => {
            if (!photo) throw new Error("No photo selected");
            return client.gallery.renamePhoto({
                id: photo.id,
                newName: newName.trim(),
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
        const trimmedName = newName.trim();
        const PHOTO_NAME_MIN_LENGTH = 8;
        const PHOTO_NAME_MAX_LENGTH = 100;

        if (
            trimmedName.length < PHOTO_NAME_MIN_LENGTH ||
            trimmedName.length > PHOTO_NAME_MAX_LENGTH
        ) {
            setError(
                `Name must be ${PHOTO_NAME_MIN_LENGTH}-${PHOTO_NAME_MAX_LENGTH} characters`
            );
            return;
        }

        if (trimmedName === photo?.name) {
            notifications.show({
                title: "No Changes",
                message: "The name is the same as before",
                color: "orange",
            });
            onClose();
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
