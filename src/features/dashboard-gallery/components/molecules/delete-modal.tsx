"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface DeleteModalProps {
    opened: boolean;
    onClose: () => void;
    photo: { id: string; name: string } | null;
    onSuccess: () => void;
}

/**
 * Modal for confirming photo deletion
 */
export function DeleteModal({
    opened,
    onClose,
    photo,
    onSuccess,
}: DeleteModalProps) {
    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!photo) throw new Error("No photo selected");
            return client.gallery.deletePhoto({ id: photo.id });
        },
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: "Photo deleted successfully",
                color: "green",
            });
            onSuccess();
            onClose();
        },
        onError: (err) => {
            console.error("Delete error:", err);
            notifications.show({
                title: "Delete Failed",
                message:
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred",
                color: "red",
            });
        },
    });

    return (
        <Modal opened={opened} onClose={onClose} title="Delete Photo" size="md">
            <Stack gap="md">
                <Text size="sm">
                    Are you sure you want to delete{" "}
                    <strong>{photo?.name}</strong>? This action cannot be
                    undone.
                </Text>

                <Group justify="flex-end" gap="sm">
                    <Button
                        variant="subtle"
                        onClick={onClose}
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={() => deleteMutation.mutateAsync()}
                        loading={deleteMutation.isPending}
                    >
                        Delete
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
