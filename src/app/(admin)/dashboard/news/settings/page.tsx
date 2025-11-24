import { Container } from "@mantine/core";

import { BlogSettingsForm } from "@/features/dashboard-blog-settings/components";

export default function BlogSettingsPage() {
    return (
        <Container size="xl" p="xl" pb={96}>
            <BlogSettingsForm />
        </Container>
    );
}
