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
            onMutate(_variables, context) {
                notifications.show({
                    title: "Creating Team Member",
                    message:
                        "Please wait while the team member is being created...",
                    color: "blue",
                });
                return context;
            },
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
            onMutate(_variables, context) {
                notifications.show({
                    title: "Updating Team Member",
                    message:
                        "Please wait while the team member is being updated...",
                    color: "blue",
                });
                return context;
            },
            onSuccess: (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Team member updated successfully",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                });
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
            onMutate(_variables, context) {
                notifications.show({
                    title: "Deleting Team Member",
                    message:
                        "Please wait while the team member is being deleted...",
                    color: "blue",
                });
                return context;
            },
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Team member deleted successfully",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                });
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
            onMutate(_variables, context) {
                notifications.show({
                    title: "Reordering Team Members",
                    message:
                        "Please wait while team members are being reordered...",
                    color: "blue",
                });
                return context;
            },
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Team members reordered successfully",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                });
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
