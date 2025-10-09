"use client";

import { client } from "@/features/admin-auth/lib/better-auth-client";
import { useEffect } from "react";

export function useAdminAuth() {
  const {
    data,
    error: sessionError,
    isPending: isSessionPending,
    refetch: refetchSession,
  } = client.useSession();

  useEffect(() => {
    /**
     * TODO: handle session changes, e.g., update global state or context
     */
  }, [data?.session]);

  return {
    user: data?.user,
    session: data?.session,
    sessionError,
    isSessionPending,
    refetchSession,

    signOut: client.signOut,
    signIn: client.signIn,
  };
}
