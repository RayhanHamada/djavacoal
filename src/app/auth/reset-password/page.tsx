import {
  Title,
  Paper,
  PasswordInput,
  Button,
  Center,
  Box,
} from "@mantine/core";

export default function Page() {
  return (
    <Center style={{ minHeight: "100vh" }}>
      <Box w={420}>
        <Title ta="center" className="mb-4">
          Reset Password
        </Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form>
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              required
              mt="sm"
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter new password"
              required
              mt="sm"
            />
            <Button type="submit" fullWidth mt="xl">
              Update Password
            </Button>
          </form>
        </Paper>
      </Box>
    </Center>
  );
}
