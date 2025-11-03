"use client";

import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useUpdateName } from "@/features/dashboard-auth/hooks";
import {
    validateUpdateNameForm,
    type UpdateNameFormValues,
} from "@/features/dashboard-auth/lib/form-schema";

type Props = {
    currentName: string;
};

/**
 * Form component for updating user's name
 * Validates name length and provides feedback
 */
export function UpdateNameForm({ currentName }: Props) {
    const { updateName, isUpdating } = useUpdateName();

    const form = useForm<UpdateNameFormValues>({
        mode: "controlled",
        initialValues: {
            name: currentName,
        },
        validate: validateUpdateNameForm,
    });

    const handleSubmit = form.onSubmit(async ({ name }) => {
        // Only update if name has changed
        if (name === currentName) {
            return;
        }

        await updateName({ name });
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <TextInput
                    label="Name"
                    placeholder="Enter your name"
                    description="Your display name (minimum 5 characters)"
                    required
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    disabled={isUpdating}
                />

                <Button
                    type="submit"
                    loading={isUpdating}
                    disabled={
                        form.values.name === currentName || !form.isValid()
                    }
                >
                    Update Name
                </Button>
            </Stack>
        </form>
    );
}
