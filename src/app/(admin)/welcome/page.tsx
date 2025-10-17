import { Container, Paper, Title, Text } from "@mantine/core";

import { OnboardingForm } from "@/features/admin-auth/components";
import { redirectJoinedUserActions } from "@/features/admin-auth/server/actions";

export default async function OnboardingPage() {
    await redirectJoinedUserActions();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container size={420}>
                <Title ta="center" className="mb-2">
                    Welcome to Djavacoal CMS
                </Title>
                <Text c="dimmed" size="sm" ta="center" className="mb-4">
                    Lets setup your admin account to get started.
                </Text>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <OnboardingForm />
                </Paper>
            </Container>
        </div>
    );
}
