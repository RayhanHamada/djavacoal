import React from "react";

import { Button, Link } from "@react-email/components";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Hr,
} from "@react-email/components";

type Props = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function ContactFormNotificationEmail({
    name = "John Doe",
    email = "user@example.com",
    phone = "+62 123 456 789",
    message = "This is a sample message from the contact form.",
}: Props) {
    const currentYear = new Date().getFullYear();

    return (
        <Html>
            <Head>
                <title>New Message from Website - CV Djavacoal Indonesia</title>
            </Head>
            <Preview>📩 New contact message from {name}</Preview>
            <Body
                style={{
                    fontFamily: "'Inter', Arial, sans-serif",
                    backgroundColor: "#f5f5f5",
                    padding: "30px 0",
                }}
            >
                <Container
                    style={{
                        maxWidth: 640,
                        backgroundColor: "#ffffff",
                        borderRadius: 14,
                        overflow: "hidden",
                        boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
                        margin: "0 auto",
                    }}
                >
                    {/* Header */}
                    <Section
                        style={{
                            backgroundColor: "#1D1D1D",
                            padding: "32px 28px 24px",
                            textAlign: "center",
                        }}
                    >
                        <Img
                            src="https://i.imgur.com/rDZiNEZ.png"
                            alt="CV Djavacoal Indonesia"
                            width={160}
                            style={{
                                display: "block",
                                margin: "0 auto 12px",
                            }}
                        />
                        <Heading
                            style={{
                                color: "#ffffff",
                                fontSize: 20,
                                margin: 0,
                                fontWeight: 600,
                            }}
                        >
                            📩 New Message from Website
                        </Heading>
                        <Text
                            style={{
                                color: "#EFA12D",
                                margin: "6px 0 0",
                                fontSize: 14,
                            }}
                        >
                            Website Contact Form Notification
                        </Text>
                    </Section>

                    {/* Body */}
                    <Section style={{ padding: "32px 40px" }}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: "#444",
                                marginBottom: 20,
                                lineHeight: 1.6,
                            }}
                        >
                            You received a new contact message from your
                            website:
                        </Text>

                        {/* Contact Information Table */}
                        <Section style={{ marginBottom: 28 }}>
                            <Row style={{ marginBottom: 8 }}>
                                <Column
                                    style={{
                                        width: "120px",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: "#222",
                                        paddingBottom: 8,
                                    }}
                                >
                                    Full Name:
                                </Column>
                                <Column
                                    style={{
                                        fontSize: 15,
                                        color: "#222",
                                        paddingBottom: 8,
                                    }}
                                >
                                    {name}
                                </Column>
                            </Row>

                            <Row style={{ marginBottom: 8 }}>
                                <Column
                                    style={{
                                        width: "120px",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: "#222",
                                        paddingBottom: 8,
                                    }}
                                >
                                    Email:
                                </Column>
                                <Column
                                    style={{
                                        fontSize: 15,
                                        color: "#222",
                                        paddingBottom: 8,
                                    }}
                                >
                                    <Link
                                        href={`mailto:${email}`}
                                        style={{
                                            color: "#EFA12D",
                                            textDecoration: "none",
                                        }}
                                    >
                                        {email}
                                    </Link>
                                </Column>
                            </Row>

                            <Row style={{ marginBottom: 8 }}>
                                <Column
                                    style={{
                                        width: "120px",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: "#222",
                                        paddingBottom: 8,
                                    }}
                                >
                                    Phone:
                                </Column>
                                <Column
                                    style={{
                                        fontSize: 15,
                                        color: "#222",
                                        paddingBottom: 8,
                                    }}
                                >
                                    {phone}
                                </Column>
                            </Row>

                            <Row style={{ marginBottom: 8 }}>
                                <Column
                                    style={{
                                        width: "120px",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: "#222",
                                        paddingBottom: 8,
                                        verticalAlign: "top",
                                    }}
                                >
                                    Message:
                                </Column>
                                <Column
                                    style={{
                                        fontSize: 15,
                                        color: "#222",
                                        paddingBottom: 8,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {message}
                                </Column>
                            </Row>
                        </Section>

                        <Hr
                            style={{
                                border: "none",
                                borderTop: "1px solid #e0e0e0",
                                margin: "28px 0",
                            }}
                        />

                        <Text
                            style={{
                                fontSize: 13,
                                color: "#666",
                                marginBottom: 20,
                                lineHeight: 1.5,
                            }}
                        >
                            This message was sent from the contact form on your
                            website.
                        </Text>

                        <Section style={{ textAlign: "left" }}>
                            <Button
                                href={`mailto:${email}`}
                                style={{
                                    display: "inline-block",
                                    backgroundColor: "#EFA12D",
                                    color: "#1D1D1D",
                                    fontWeight: 600,
                                    padding: "12px 28px",
                                    borderRadius: 6,
                                    textDecoration: "none",
                                    fontSize: 14,
                                }}
                            >
                                Reply to {name}
                            </Button>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section
                        style={{
                            backgroundColor: "#1D1D1D",
                            textAlign: "center",
                            padding: "18px 10px",
                            color: "#999",
                            fontSize: 12,
                        }}
                    >
                        <Text style={{ margin: 0, color: "#999" }}>
                            © {currentYear} CV Djavacoal Indonesia — All Rights
                            Reserved
                        </Text>
                        <Text style={{ margin: "4px 0 0", color: "#EFA12D" }}>
                            www.djavacoal.com
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
