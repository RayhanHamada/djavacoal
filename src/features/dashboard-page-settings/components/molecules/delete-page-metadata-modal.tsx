"use client";

import { Button, Group, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface DeletePageMetadataModalProps {
    opened: boolean;
    onClose: () => void;
    pageMetadata: { id: number; path: string } | null;
    onSuccess: () => void;
}

/**
 * Modal for deleting a page metadata entry
 */
export function DeletePageMetadataModal({
    opened,
    onClose,
    pageMetadata,
    onSuccess,
}: DeletePageMetadataModalProps) {
    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!pageMetadata) throw new Error("No page metadata selected");
            return client.pageSettings.deletePageMetadata({
                id: pageMetadata.id,
            });
        },
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: "Page metadata deleted successfully",
                color: "green",
            });
            onSuccess();
            onClose();
        },
        onError: (error) => {
            notifications.show({
                title: "Delete Failed",
                message:
                    error instanceof Error
                        ? error.message
                        : "An error occurred",
                color: "red",
            });
        },
    });

    const handleDelete = async () => {
        await deleteMutation.mutateAsync();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Delete Page Metadata"
            size="md"
        >
            <Text size="sm" mb="lg">
                Are you sure you want to delete the page metadata for{" "}
                <strong>{pageMetadata?.path}</strong>? This action cannot be
                undone.
            </Text>

            <Group justify="flex-end">
                <Button
                    variant="subtle"
                    onClick={onClose}
                    disabled={deleteMutation.isPending}
                >
                    Cancel
                </Button>
                <Button
                    color="red"
                    onClick={handleDelete}
                    loading={deleteMutation.isPending}
                >
                    Delete
                </Button>
            </Group>
        </Modal>
    );
}
