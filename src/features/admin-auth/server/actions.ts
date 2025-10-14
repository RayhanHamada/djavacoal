"use server";

import {
  redirectUnauthenticatedUser,
  redirectJoinedUser,
  onboardAdmin as setupFirstUser,
  redirectAuthenticatedUser,
  checkNeedsPassword,
  setPassword,
} from "@/features/admin-auth/server/functions";
import { onSuccess } from "@orpc/client";
import { redirect } from "next/navigation";

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
