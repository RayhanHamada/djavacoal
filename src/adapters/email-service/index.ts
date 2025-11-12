import { createTransport as createNodemailerTransport } from "nodemailer";
import { Resend } from "resend";

export function getResend(apiKey: string) {
    return new Resend(apiKey);
}

export function getNodemailerTransporter() {
    const transporter = createNodemailerTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter;
}
