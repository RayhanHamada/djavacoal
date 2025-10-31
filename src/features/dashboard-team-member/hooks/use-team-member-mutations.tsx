"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

/**
 * Hook for team member mutations (create, update, delete, reorder)
 */
export function useTeamMemberMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation(
        rpc.dashboardTeamMember.createTeamMember.mutationOptions({
            onSuccess() {
                queryClient.invalidateQueries({
                    queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                });
                notifications.show({
                    title: "Success",
                    message: "Team member created successfully",
                    color: "green",
                });
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
            onSuccess() {
                queryClient.invalidateQueries({
                    queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                });
                notifications.show({
                    title: "Success",
                    message: "Team member updated successfully",
                    color: "green",
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
            onSuccess() {
                queryClient.invalidateQueries({
                    queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                });
                notifications.show({
                    title: "Success",
                    message: "Team member deleted successfully",
                    color: "green",
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
            onSuccess() {
                queryClient.invalidateQueries({
                    queryKey: rpc.dashboardTeamMember.listTeamMembers.key(),
                });
            },
            onError(error: Error) {
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
