import { render } from "@react-email/components";

import { getNodemailerTransporter } from "@/adapters/email-service";
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

        // ✅ Template email modern khas Djavacoal
        const htmlContent = await render(
            <ContactFormNotificationEmail
                name={name}
                email={email}
                phone={phone}
                message={message}
            />
        );

        const transporter = getNodemailerTransporter();

        // ✅ Kirim email
        await transporter.sendMail({
            from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.RECIPIENT_EMAIL,
            subject: `[Website Djavacoal] New Message from ${name}`,
            html: htmlContent,
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return Response.json({ success: false, error }, { status: 500 });
    }
}
