"use client";

import { client } from "@/features/dashboard-auth/lib/better-auth-client";

/**
 * Hook to get current user session
 * Uses Better Auth's useSession hook
 */
export function useCurrentUser() {
    const session = client.useSession();

    return {
        user: session.data?.user,
        isLoading: session.isPending,
    };
}
