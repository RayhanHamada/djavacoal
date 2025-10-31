"use client";

import type { TeamMemberListItem } from "../../server/schemas";

import { useEffect, useState } from "react";

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
    Box,
    Button,
    Container,
    Grid,
    Group,
    Loader,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { useTeamMemberMutations, useTeamMembersList } from "../../hooks";
import { TeamMemberCard } from "../atoms";
import { TeamMemberModal } from "../molecules";

/**
 * TeamMembersListView component displays team members in a 4-column grid with drag-and-drop reordering
 */
export function TeamMembersListView() {
    const { data, isLoading } = useTeamMembersList();
    const { deleteMutation, reorderMutation } = useTeamMemberMutations();

    const [opened, { open, close }] = useDisclosure(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState<
        TeamMemberListItem | undefined
    >(undefined);

    const [teamMembers, setTeamMembers] = useState<TeamMemberListItem[]>([]);

    // Update local state when data changes
    useEffect(() => {
        if (data?.teamMembers) {
            setTeamMembers(data.teamMembers);
        }
    }, [data?.teamMembers]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = teamMembers.findIndex(
                (item) => item.id === active.id
            );
            const newIndex = teamMembers.findIndex(
                (item) => item.id === over.id
            );

            const reordered = arrayMove(teamMembers, oldIndex, newIndex);
            setTeamMembers(reordered);

            // Send reorder request
            reorderMutation.mutate({
                order: reordered.map((item) => item.id),
            });
        }
    };

    const handleCreate = () => {
        setSelectedTeamMember(undefined);
        open();
    };

    const handleEdit = (teamMember: TeamMemberListItem) => {
        setSelectedTeamMember(teamMember);
        open();
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate({ id });
    };

    const handleModalClose = () => {
        close();
        setSelectedTeamMember(undefined);
    };

    return (
        <Container size="xl" py="xl">
            <Box>
                <Group justify="space-between" mb="xl">
                    <Title order={2}>Team Members</Title>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleCreate}
                    >
                        Add Team Member
                    </Button>
                </Group>

                {isLoading && (
                    <Box ta="center" py="xl">
                        <Loader size="lg" />
                    </Box>
                )}

                {!isLoading && !teamMembers.length && (
                    <Box ta="center" py="xl">
                        <Title order={4} c="dimmed">
                            No team members yet. Add your first team member!
                        </Title>
                    </Box>
                )}

                {!isLoading && teamMembers.length && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={teamMembers.map((item) => item.id)}
                        >
                            <Grid gutter="md">
                                {teamMembers.map((teamMember) => (
                                    <Grid.Col
                                        key={teamMember.id}
                                        span={{
                                            base: 12,
                                            sm: 6,
                                            md: 4,
                                            lg: 3,
                                        }}
                                    >
                                        <TeamMemberCard
                                            teamMember={teamMember}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </SortableContext>
                    </DndContext>
                )}

                <TeamMemberModal
                    opened={opened}
                    onClose={handleModalClose}
                    teamMember={selectedTeamMember}
                />
            </Box>
        </Container>
    );
}
