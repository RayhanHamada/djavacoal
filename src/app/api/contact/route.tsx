import { getCloudflareContext } from "@opennextjs/cloudflare";
import { render } from "@react-email/components";
import console from "console";

import { getResend } from "@/adapters/email-service";
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
                to: process.env.RECIPIENT_EMAIL,
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
