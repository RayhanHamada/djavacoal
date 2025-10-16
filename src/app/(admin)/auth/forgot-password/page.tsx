import { ForgotPasswordCard } from "@/features/admin-auth/components/molecules";
import { Box } from "@mantine/core";

/**
 * Forgot Password Page
 * Allows users to request a password reset email
 * Available at /auth/forgot-password
 */
export default function ForgotPasswordPage() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ForgotPasswordCard />
    </Box>
  );
}
