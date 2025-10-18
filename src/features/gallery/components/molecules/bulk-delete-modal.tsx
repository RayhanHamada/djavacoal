"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface BulkDeleteModalProps {
    opened: boolean;
    onClose: () => void;
    photoIds: string[];
    onSuccess: () => void;
}

/**
 * Modal for confirming bulk photo deletion
 */
export function BulkDeleteModal({
    opened,
    onClose,
    photoIds,
    onSuccess,
}: BulkDeleteModalProps) {
    const bulkDeleteMutation = useMutation({
        mutationFn: async () => {
            return client.gallery.bulkDeletePhotos({ ids: photoIds });
        },
        onSuccess: (result) => {
            notifications.show({
                title: "Success",
                message: `Deleted ${result.deletedCount} photo(s)`,
                color: "green",
            });
            onSuccess();
            onClose();
        },
        onError: (err) => {
            notifications.show({
                title: "Delete Failed",
                message:
                    err instanceof Error ? err.message : "An error occurred",
                color: "red",
            });
        },
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Delete Photos"
            size="md"
        >
            <Stack gap="md">
                <Text size="sm">
                    Are you sure you want to delete{" "}
                    <strong>{photoIds.length}</strong> photo(s)? This action
                    cannot be undone.
                </Text>

                <Group justify="flex-end" gap="sm">
                    <Button
                        variant="subtle"
                        onClick={onClose}
                        disabled={bulkDeleteMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={() => bulkDeleteMutation.mutateAsync()}
                        loading={bulkDeleteMutation.isPending}
                    >
                        Delete All
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
