"use client";

import { Paper, Title, Container, type PaperProps } from "@mantine/core";

import { ForgotPasswordForm } from "../organism/forgot-password-form";

type Props = {
    title?: string;
    paperProps?: PaperProps;
    onSuccess?: () => void;
};

/**
 * Forgot Password Card Component
 * Wraps the forgot password form in a styled card container
 */
export function ForgotPasswordCard({
    title = "Forgot Password",
    paperProps,
    onSuccess,
}: Props) {
    return (
        <Container size="xl" w={420}>
            <Title ta="center" mb="md">
                {title}
            </Title>
            <Paper withBorder shadow="md" p={30} radius="md" {...paperProps}>
                <ForgotPasswordForm onSuccess={onSuccess} />
            </Paper>
        </Container>
    );
}
