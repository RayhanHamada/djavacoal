"use client";

import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ActionIcon,
    Collapse,
    Group,
    Paper,
    SegmentedControl,
    Text,
} from "@mantine/core";
import {
    IconEdit,
    IconGripVertical,
    IconTrash,
    IconChevronDown,
    IconChevronUp,
} from "@tabler/icons-react";

import { FaqListItem } from "../../server/schemas";

interface FaqCollapsibleItemProps {
    faq: FaqListItem;
    onEdit: (faq: FaqListItem) => void;
    onDelete: (id: number) => void;
}

export function FaqCollapsibleItem({
    faq,
    onEdit,
    onDelete,
}: FaqCollapsibleItemProps) {
    const [opened, setOpened] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar">("en");

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: faq.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const displayQuestion =
        selectedLanguage === "en" ? faq.en_question : faq.ar_question;
    const displayAnswer =
        selectedLanguage === "en" ? faq.en_answer : faq.ar_answer;

    return (
        <Paper
            ref={setNodeRef}
            style={style}
            withBorder
            p="md"
            radius="md"
            shadow="sm"
        >
            <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" style={{ flex: 1 }}>
                    <ActionIcon
                        {...listeners}
                        {...attributes}
                        variant="subtle"
                        color="gray"
                        style={{ cursor: "grab" }}
                    >
                        <IconGripVertical size={20} />
                    </ActionIcon>

                    <div style={{ flex: 1 }}>
                        <Text fw={500} size="sm">
                            {displayQuestion || "(No question)"}
                        </Text>
                    </div>
                </Group>

                <Group gap="xs" wrap="nowrap">
                    <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => setOpened(!opened)}
                    >
                        {opened ? (
                            <IconChevronUp size={18} />
                        ) : (
                            <IconChevronDown size={18} />
                        )}
                    </ActionIcon>
                    <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => onEdit(faq)}
                    >
                        <IconEdit size={18} />
                    </ActionIcon>
                    <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => onDelete(faq.id)}
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                </Group>
            </Group>

            <Collapse in={opened}>
                <div style={{ marginTop: "16px" }}>
                    <SegmentedControl
                        value={selectedLanguage}
                        onChange={(value) =>
                            setSelectedLanguage(value as "en" | "ar")
                        }
                        data={[
                            { label: "English", value: "en" },
                            { label: "Arabic", value: "ar" },
                        ]}
                        size="xs"
                        mb="md"
                    />

                    <div>
                        <Text size="sm" fw={500} mb="xs">
                            Answer:
                        </Text>
                        <div
                            dangerouslySetInnerHTML={{ __html: displayAnswer }}
                            style={{
                                fontSize: "14px",
                                color: "var(--mantine-color-dimmed)",
                            }}
                        />
                    </div>
                </div>
            </Collapse>
        </Paper>
    );
}
