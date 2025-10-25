"use client";

import Link from "next/link";

import { ActionIcon, Card, Group, Image, Menu, Text } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

type PackagingOptionCardProps = {
    id: number;
    enName: string;
    arName: string;
    enDescription: string;
    arDescription: string;
    photoUrl: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

export function PackagingOptionCard({
    id,
    enName,
    arName,
    photoUrl,
    onEdit,
    onDelete,
}: PackagingOptionCardProps) {
    const t = useTranslations("PackagingOptions");

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section
                component={Link}
                href={`/dashboard/products/packaging-options/${id}/edit`}
            >
                <Image src={photoUrl} height={160} alt={enName} fit="cover" />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <div>
                    <Text fw={500}>{enName}</Text>
                    <Text size="sm" c="dimmed">
                        {arName}
                    </Text>
                </div>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={16} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => onEdit(id)}
                        >
                            {t("actions.edit")}
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => onDelete(id)}
                        >
                            {t("actions.delete")}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </Card>
    );
}
