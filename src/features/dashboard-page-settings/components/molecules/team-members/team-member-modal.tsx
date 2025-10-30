"use client";

import type { TeamMemberListItem } from "@/features/dashboard-page-settings/server/team-members/schemas";

import { Modal } from "@mantine/core";

import { TeamMemberForm } from "./team-member-form";
import { useTeamMemberMutations } from "@/features/dashboard-page-settings/hooks/team-members";

interface TeamMemberModalProps {
    opened: boolean;
    onClose: () => void;
    teamMember?: TeamMemberListItem;
}

/**
 * TeamMemberModal component for creating/editing team members
 */
export function TeamMemberModal({
    opened,
    onClose,
    teamMember,
}: TeamMemberModalProps) {
    const { createMutation, updateMutation } = useTeamMemberMutations();

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = async (data: {
        name: string;
        position: string;
        photo_key: string;
    }) => {
        try {
            if (teamMember) {
                await updateMutation.mutateAsync({
                    id: teamMember.id,
                    ...data,
                });
            } else {
                await createMutation.mutateAsync(data);
            }
            onClose();
        } catch (error) {
            // Error already handled by mutation hook
            console.error("Submission error:", error);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={teamMember ? "Edit Team Member" : "Add Team Member"}
            size="lg"
            closeOnClickOutside={!isSubmitting}
            closeOnEscape={!isSubmitting}
            withCloseButton={!isSubmitting}
        >
            <TeamMemberForm
                teamMember={teamMember}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
            />
        </Modal>
    );
}
