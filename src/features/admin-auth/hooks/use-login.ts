"use client";

import { useForm } from "@mantine/form";
import { validateLoginForm } from "@/features/admin-auth/lib/form-schema";
import { notifications } from "@mantine/notifications";
import { client } from "@/features/admin-auth/lib/better-auth-client";

type Options = {
  onSuccess?(): void;
};

export const useLogin = (options?: Options) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLoginForm,
  });

  const handleSubmit = form.onSubmit(async ({ email, password }) => {
    const res = await client.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
      rememberMe: true,
    });

    if (res?.error) {
      notifications.show({
        message: res.error.message,
        color: "red",
      });

      return;
    }

    notifications.show({
      message: "Logged in successfully",
      color: "green",
    });

    options?.onSuccess?.();
  });

  return {
    form,
    handleSubmit,
    isLoading: form.submitting,
  };
};
