import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Preview,
  Link,
} from "@react-email/components";

type Props = {
  email: string;
  link: string;
};

export default function AdminResetPasswordEmail({
  link = "http://localhost:3000/auth/reset-password",
  email = "user@example.com",
}: Props) {
  return (
    <Html>
      <Head>
        <title>Reset Your Password - Djavacoal CMS</title>
      </Head>
      <Preview>Reset your Djavacoal CMS account password</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: 0,
          backgroundColor: "#f4f4f4",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "20px",
          }}
        >
          <Section style={{ textAlign: "center", padding: "10px 0" }}>
            <Heading as="h1" style={{ color: "#333" }}>
              Djavacoal
            </Heading>
          </Section>
          <Section>
            <Heading as="h2">Reset Your Password</Heading>
            <Text>Hello, {email}</Text>
            <Text>
              We received a request to reset your password for your Djavacoal
              CMS account. If you made this request, click the button below to
              reset your password:
            </Text>
            <Section style={{ textAlign: "center", margin: "20px 0" }}>
              <Button
                href={link}
                style={{
                  backgroundColor: "#007bff",
                  color: "#ffffff",
                  padding: "10px 20px",
                  textDecoration: "none",
                  borderRadius: "5px",
                  display: "inline-block",
                }}
              >
                Reset Password
              </Button>
            </Section>

            <Text>
              If you didn&apos;t request a password reset, please ignore this
              email. Your password will remain unchanged.
            </Text>
            <Text
              style={{
                marginTop: 16,
                fontSize: 12,
                color: "#6b7280",
                wordBreak: "break-all",
              }}
            >
              If the button doesn&apos;t work, copy and paste the following link
              into your browser:
              <br />
              <Link
                href={link}
                style={{ color: "#2563eb", textDecoration: "none" }}
              >
                {link}
              </Link>
            </Text>
            <Text>
              Best regards,
              <br />
              The Djavacoal Team
            </Text>
          </Section>

          <Text>&copy; 2023 Djavacoal. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  );
}
