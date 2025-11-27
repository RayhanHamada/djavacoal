import { getCloudflareContext } from "@opennextjs/cloudflare";
import { render } from "@react-email/components";
import console from "console";

import { getResend } from "@/adapters/email-service";
import { KV_KEYS } from "@/adapters/kv/constants";
import { ContactFormNotificationEmail } from "@/templates/emails";

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as {
            name: string;
            email: string;
            phone: string;
            message: string;
        };

        const { name, email, phone, message } = body;

        /**
         * check if todays limit reached
         */
        const { env } = await getCloudflareContext({ async: true });

        // Get recipient email from KV
        const recipientEmail = await env.DJAVACOAL_KV.get(
            KV_KEYS.RECIPIENT_EMAIL
        );

        if (!recipientEmail) {
            return Response.json(
                {
                    success: false,
                    error: "Recipient email not configured. Please configure it in dashboard settings.",
                },
                { status: 500 }
            );
        }

        // ✅ Template email modern khas Djavacoal
        const htmlContent = await render(
            <ContactFormNotificationEmail
                name={name}
                email={email}
                phone={phone}
                message={message}
            />
        );

        const emailService = getResend(env.RESEND_API_KEY);

        try {
            await emailService.emails.send({
                from: `Djavacoal Notification <${process.env.SENDER_EMAIL}>`,
                to: recipientEmail,
                subject: `[Website Djavacoal] New Message from ${name}`,
                html: htmlContent,
            });
        } catch {
            return Response.json(
                { success: false, error: "Failed to send email via Resend" },
                { status: 500 }
            );
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return Response.json({ success: false, error }, { status: 500 });
    }
}
