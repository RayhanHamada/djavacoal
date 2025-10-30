"use client";

import { useQuery } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

/**
 * Hook for fetching team members list
 */
export function useTeamMembersList() {
    return useQuery(rpc.pageSettings.listTeamMembers.queryOptions());
}
