import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
} from "@mantine/core";

export default function Page() {
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
        <Title ta="center" className="mb-4">
          Welcome to Djavacoal Admin
        </Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form>
            <TextInput label="Email" placeholder="your@email.com" required />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
            />
            <Button fullWidth mt="xl">
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
