import { Box } from "@mantine/core";

import { LoginCard } from "@/features/admin-auth/components";

export default async function Page() {
    return (
        <Box
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <LoginCard />
        </Box>
    );
}
