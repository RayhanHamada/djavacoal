"use client";

import type { TeamMemberListItem } from "@/features/dashboard-page-settings/server/team-members/schemas";

import { useState } from "react";

import Image from "next/image";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ActionIcon,
    Card,
    MantineStyleProp,
    Menu,
    Stack,
    Text,
} from "@mantine/core";
import {
    IconDotsVertical,
    IconGripVertical,
    IconTrash,
} from "@tabler/icons-react";
import { PhotoView } from "react-photo-view";

import {
    CARD_NAME_TRUNCATE_LENGTH,
    CARD_POSITION_TRUNCATE_LENGTH,
} from "@/features/dashboard-page-settings/server/team-members/constants";

interface TeamMemberCardProps {
    teamMember: TeamMemberListItem;
    onEdit: (teamMember: TeamMemberListItem) => void;
    onDelete: (id: number) => void;
}

/**
 * TeamMemberCard component displays a single team member with drag handle and actions
 */
export function TeamMemberCard({
    teamMember,
    onEdit,
    onDelete,
}: TeamMemberCardProps) {
    const [imageError, setImageError] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: teamMember.id });

    const style: MantineStyleProp = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "pointer",
    };

    const handleDelete = () => {
        if (
            confirm(
                `Are you sure you want to delete ${teamMember.name}? This action cannot be undone.`
            )
        ) {
            onDelete(teamMember.id);
        }
    };

    const imageSrc = imageError
        ? "/images/placeholder-product.jpg"
        : `${process.env.NEXT_PUBLIC_ASSET_URL}${teamMember.photo_key}`;

    const truncatedName =
        teamMember.name.length > CARD_NAME_TRUNCATE_LENGTH
            ? `${teamMember.name.slice(0, CARD_NAME_TRUNCATE_LENGTH)}...`
            : teamMember.name;

    const truncatedPosition =
        teamMember.position.length > CARD_POSITION_TRUNCATE_LENGTH
            ? `${teamMember.position.slice(0, CARD_POSITION_TRUNCATE_LENGTH)}...`
            : teamMember.position;

    return (
        <Card
            ref={setNodeRef}
            style={style}
            shadow="sm"
            radius="md"
            withBorder
            h={380}
            w={210}
        >
            <Card.Section>
                <div style={{ position: "relative", height: 280 }}>
                    <PhotoView src={imageSrc}>
                        <Image
                            src={imageSrc}
                            fill
                            style={{ objectFit: "cover" }}
                            alt={teamMember.name}
                            onError={() => setImageError(true)}
                        />
                    </PhotoView>

                    {/* Drag Handle */}
                    <div
                        {...listeners}
                        {...attributes}
                        style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            borderRadius: "6px",
                            padding: "6px",
                            cursor: "grab",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(4px)",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "rgba(0, 0, 0, 0.85)";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "rgba(0, 0, 0, 0.7)";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <IconGripVertical size={20} color="white" />
                    </div>

                    {/* Actions Menu */}
                    <div
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                        }}
                    >
                        <Menu shadow="md" width={150}>
                            <Menu.Target>
                                <ActionIcon
                                    variant="filled"
                                    size="lg"
                                    style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        backdropFilter: "blur(4px)",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            "rgba(0, 0, 0, 0.85)";
                                        e.currentTarget.style.transform =
                                            "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            "rgba(0, 0, 0, 0.7)";
                                        e.currentTarget.style.transform =
                                            "scale(1)";
                                    }}
                                >
                                    <IconDotsVertical size={18} color="white" />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item
                                    color="red"
                                    leftSection={<IconTrash size={14} />}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </div>
            </Card.Section>

            <Stack
                gap="xs"
                mt="sm"
                onClick={() => onEdit(teamMember)}
                style={{ cursor: "pointer" }}
            >
                <Text fw={600} size="sm" lineClamp={2} title={teamMember.name}>
                    {truncatedName}
                </Text>
                <Text
                    size="xs"
                    c="dimmed"
                    lineClamp={1}
                    title={teamMember.position}
                >
                    {truncatedPosition}
                </Text>
            </Stack>
        </Card>
    );
}
