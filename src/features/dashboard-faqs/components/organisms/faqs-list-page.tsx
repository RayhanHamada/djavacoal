"use client";

import { useState } from "react";

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    Button,
    Container,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { FaqCollapsibleItem } from "./faq-collapsible-item";
import { FaqListItem } from "../../server/schemas";
import { FaqModal } from "../molecules/faq-modal";
import { rpc } from "@/lib/rpc";

export function FaqsListPage() {
    const [modalOpened, { open: openModal, close: closeModal }] =
        useDisclosure(false);
    const [editingFaq, setEditingFaq] = useState<FaqListItem | null>(null);
    const [activeFaq, setActiveFaq] = useState<FaqListItem | null>(null);

    // Fetch FAQs
    const {
        data: faqsData,
        isLoading,
        isError,
    } = useQuery(rpc.dashboardFaqs.listFaqs.queryOptions());

    const faqs = faqsData?.faqs ?? [];

    // Reorder mutation
    const reorderMutation = useMutation(
        rpc.dashboardFaqs.reorderFaqs.mutationOptions({
            onMutate() {
                notifications.show({
                    title: "Reordering FAQs...",
                    message: "Please wait while we reorder the FAQs.",
                    color: "blue",
                });
            },
            onSuccess: (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "FAQs reordered successfully",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardFaqs.listFaqs.key(),
                });
            },
            onError: (error: Error) => {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to reorder FAQs",
                    color: "red",
                });
            },
        })
    );

    // Delete mutation
    const deleteMutation = useMutation(
        rpc.dashboardFaqs.deleteFaq.mutationOptions({
            onMutate() {
                notifications.show({
                    title: "Deleting FAQ...",
                    message: "Please wait while we delete the FAQ.",
                    color: "blue",
                });
            },
            onSuccess: (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "FAQ deleted successfully",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardFaqs.listFaqs.key(),
                });
            },
            onError: (error: Error) => {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to delete FAQ",
                    color: "red",
                });
            },
        })
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: { active: { id: string | number } }) => {
        const faq = faqs.find((f) => f.id === event.active.id) ?? null;
        setActiveFaq(faq);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveFaq(null);

        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = faqs.findIndex((f) => f.id === active.id);
            const newIndex = faqs.findIndex((f) => f.id === over.id);

            const newFaqs = arrayMove(faqs, oldIndex, newIndex);
            const newOrder = newFaqs.map((f) => f.id);

            reorderMutation.mutate({ order: newOrder });
        }
    };

    const handleEdit = (faq: FaqListItem) => {
        setEditingFaq(faq);
        openModal();
    };

    const handleDelete = (id: number) => {
        modals.openConfirmModal({
            title: "Delete FAQ",
            children: (
                <Text size="sm">
                    Are you sure you want to delete this FAQ? This action cannot
                    be undone.
                </Text>
            ),
            labels: { confirm: "Delete", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () => deleteMutation.mutate({ id }),
        });
    };

    const handleCreateNew = () => {
        setEditingFaq(null);
        openModal();
    };

    const handleCloseModal = () => {
        closeModal();
        setEditingFaq(null);
    };

    if (isLoading) {
        return (
            <Container size="lg" py="xl">
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text c="dimmed">Loading FAQs...</Text>
                </Stack>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container size="lg" py="xl">
                <Paper p="xl" withBorder>
                    <Text c="red">Failed to load FAQs. Please try again.</Text>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Frequently Asked Questions</Title>
                <Button
                    leftSection={<IconPlus size={18} />}
                    onClick={handleCreateNew}
                >
                    Create FAQ
                </Button>
            </Group>

            {!faqs.length ? (
                <Paper p="xl" withBorder>
                    <Stack align="center" gap="md">
                        <Text c="dimmed">No FAQs yet</Text>
                        <Button
                            leftSection={<IconPlus size={18} />}
                            onClick={handleCreateNew}
                        >
                            Create First FAQ
                        </Button>
                    </Stack>
                </Paper>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={faqs.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Stack gap="md">
                            {faqs.map((faq) => (
                                <FaqCollapsibleItem
                                    key={faq.id}
                                    faq={faq}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </Stack>
                    </SortableContext>

                    <DragOverlay>
                        {activeFaq ? (
                            <Paper
                                withBorder
                                p="md"
                                radius="md"
                                shadow="lg"
                                style={{ cursor: "grabbing" }}
                            >
                                <Text fw={500} size="sm">
                                    {activeFaq.en_question}
                                </Text>
                            </Paper>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            <FaqModal
                opened={modalOpened}
                onClose={handleCloseModal}
                faqToEdit={
                    editingFaq
                        ? {
                              id: editingFaq.id,
                              en_question: editingFaq.en_question,
                              ar_question: editingFaq.ar_question,
                              en_answer: editingFaq.en_answer,
                              ar_answer: editingFaq.ar_answer,
                          }
                        : undefined
                }
            />
        </Container>
    );
}
