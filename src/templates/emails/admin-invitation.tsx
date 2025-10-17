import React from "react";

import { Button, Link } from "@react-email/components";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";

type Props = {
    email: string;
    link: string;
};

export default function AdminInvitationEmail({
    link = "http://localhost:3000/auth/reset-password",
    email = "user@example.com",
}: Props) {
    return (
        <Html>
            <Head>
                <title>Invitation - Djavacoal CMS</title>
            </Head>
            <Preview>Invitation to join djavacoal</Preview>
            <Body
                style={{
                    backgroundColor: "#f3f4f6",
                    fontFamily: "Arial, sans-serif",
                    padding: "20px",
                }}
            >
                <Container
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        padding: "24px",
                        maxWidth: 600,
                    }}
                >
                    <Section style={{ textAlign: "center", paddingBottom: 20 }}>
                        <Heading
                            style={{
                                margin: 0,
                                fontSize: 24,
                                color: "#111827",
                            }}
                        >
                            Djavacoal
                        </Heading>
                        <Text
                            style={{
                                marginTop: 6,
                                color: "#6b7280",
                                fontSize: 14,
                            }}
                        >
                            You&apos;re invited to join Djavacoal
                        </Text>
                    </Section>

                    <Section style={{ paddingBottom: 16 }}>
                        <Text style={{ fontSize: 16, color: "#111827" }}>
                            Hi {email},
                        </Text>

                        <Text
                            style={{
                                marginTop: 12,
                                fontSize: 14,
                                color: "#374151",
                                lineHeight: 1.5,
                            }}
                        >
                            You have been invited to join the djavacoal
                            workspace. Click the button below to accept the
                            invitation. This link will expire in 24 hours.
                        </Text>

                        <Section
                            style={{ textAlign: "center", paddingTop: 18 }}
                        >
                            <Button
                                href={link}
                                style={{
                                    backgroundColor: "#2563eb",
                                    color: "#ffffff",
                                    borderRadius: 6,
                                    padding: "10px 18px",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Accept Invitation
                            </Button>
                        </Section>

                        <Text
                            style={{
                                marginTop: 16,
                                fontSize: 12,
                                color: "#6b7280",
                                wordBreak: "break-all",
                            }}
                        >
                            If the button doesn&apos;t work, copy and paste the
                            following link into your browser:
                            <br />
                            <Link
                                href={link}
                                style={{
                                    color: "#2563eb",
                                    textDecoration: "none",
                                }}
                            >
                                {link}
                            </Link>
                        </Text>
                    </Section>

                    <Section
                        style={{
                            borderTop: "1px solid #e5e7eb",
                            marginTop: 18,
                            paddingTop: 12,
                        }}
                    >
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
