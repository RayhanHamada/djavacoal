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
  Link,
} from "@react-email/components";

type Props = {
  resetLink: string;
};

export default function AdminResetPasswordEmail({ resetLink }: Props) {
  return (
    <Html>
      <Head>
        <title>Reset Your Password - Djavacoal CMS</title>
      </Head>
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
            <Text>Hello,</Text>
            <Text>
              We received a request to reset your password for your Djavacoal
              account. If you made this request, click the button below to reset
              your password:
            </Text>
            <Section style={{ textAlign: "center", margin: "20px 0" }}>
              <Button
                href={resetLink}
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
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Text>
              <Link href={resetLink}>{resetLink}</Link>
            </Text>
            <Text>
              If you didn&apos;t request a password reset, please ignore this
              email. Your password will remain unchanged.
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
