import { Box } from "@mantine/core";

import { ResetPasswordCard } from "@/features/admin-auth/components/molecules";

/**
 * Reset Password Page
 * Allows users to set a new password using the reset token from email
 * Available at /auth/reset-password
 */
export default function ResetPasswordPage() {
    return (
        <Box
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ResetPasswordCard />
        </Box>
    );
}
