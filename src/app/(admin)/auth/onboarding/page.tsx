"use client";

import { Container, Paper, Title, Text } from "@mantine/core";
import { OnboardingForm } from "@/features/admin-auth/components";

export default function OnboardingPage() {
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
          Complete Your Onboarding
        </Title>
        <Text c="dimmed" size="sm" ta="center" className="mb-4">
          Set up your admin account for Djavacoal CMS
        </Text>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <OnboardingForm />
        </Paper>
      </Container>
    </div>
  );
}
