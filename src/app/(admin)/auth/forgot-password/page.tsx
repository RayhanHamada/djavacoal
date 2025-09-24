import { TextInput, Button, Paper, Title, Container } from "@mantine/core";

export default function Page() {
  return (
    <Container
      size={420}
      my={40}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          position: "absolute",
          top: "40%",
          transform: "translateY(-40%)",
        }}
      >
        <Title ta="center" className="mb-4">
          Change Password
        </Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form>
            <TextInput label="Email" placeholder="your@email.com" required />
            <Button fullWidth mt="xl">
              Submit
            </Button>
          </form>
        </Paper>
      </div>
    </Container>
  );
}
