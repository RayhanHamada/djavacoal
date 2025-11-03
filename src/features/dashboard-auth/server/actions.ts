"use server";

import { redirect } from "next/navigation";

import { onSuccess } from "@orpc/client";

import {
    redirectUnauthenticatedUser,
    redirectJoinedUser,
    setupFirstUser as setupFirstUser,
    redirectAuthenticatedUser,
    checkNeedsPassword,
    setPassword,
} from "@/features/dashboard-auth/server/functions";

export const setupFirstUserActions = setupFirstUser.actionable({
    interceptors: [
        onSuccess(async function () {
            redirect("/auth/login");
        }),
    ],
});

export const redirectJoinedUserActions = redirectJoinedUser.actionable({
    interceptors: [
        onSuccess(async function ({ onboarded }) {
            if (onboarded) redirect("/auth/login");
        }),
    ],
});

export const redirectUnauthenticatedUserActions =
    redirectUnauthenticatedUser.actionable({
        interceptors: [
            onSuccess(async function ({ user }) {
                if (!user) redirect("/auth/login");
            }),
        ],
    });

export const redirectAuthenticatedUserActions =
    redirectAuthenticatedUser.actionable({
        interceptors: [
            onSuccess(async function ({ user }) {
                if (user) redirect("/dashboard");
            }),
        ],
    });

export const checkNeedsPasswordActions = checkNeedsPassword.actionable();

export const setPasswordActions = setPassword.actionable();
