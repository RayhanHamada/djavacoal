"use client";

import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

/**
 * Hook for team member mutations (create, update, delete, reorder)
 */
export function useTeamMemberMutations() {
    const createMutation = useMutation(
        rpc.dashboardTeamMember.createTeamMember.mutationOptions({
            onSuccess: (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Team member created successfully",
                    color: "green",
                });

                Promise.all([
                    client.invalidateQueries({
                        queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                    }),
                ]);
            },
            onError(error: Error) {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to create team member",
                    color: "red",
                });
            },
        })
    );

    const updateMutation = useMutation(
        rpc.dashboardTeamMember.updateTeamMember.mutationOptions({
            onSuccess: (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Team member updated successfully",
                    color: "green",
                });

                Promise.all([
                    client.invalidateQueries({
                        queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                    }),
                ]);
            },
            onError(error: Error) {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to update team member",
                    color: "red",
                });
            },
        })
    );

    const deleteMutation = useMutation(
        rpc.dashboardTeamMember.deleteTeamMember.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Team member deleted successfully",
                    color: "green",
                });

                Promise.all([
                    client.invalidateQueries({
                        queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                    }),
                ]);
            },
            onError(error: Error) {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to delete team member",
                    color: "red",
                });
            },
        })
    );

    const reorderMutation = useMutation(
        rpc.dashboardTeamMember.reorderTeamMembers.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Team members reordered successfully",
                    color: "green",
                });

                await Promise.all([
                    client.invalidateQueries({
                        queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                    }),
                ]);
            },
            onError: (error) => {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to reorder team members",
                    color: "red",
                });
            },
        })
    );

    return {
        createMutation,
        updateMutation,
        deleteMutation,
        reorderMutation,
    };
}
