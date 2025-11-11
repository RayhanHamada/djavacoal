import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body: {
            name: string;
            email: string;
            phone: string;
            message: string;
        } = await req.json();

        const { name, email, phone, message } = body;

        // ✅ Gmail transporter (gunakan App Password)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // ✅ Template email modern khas Djavacoal
        const htmlContent = `
      <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
        <table align="center" cellpadding="0" cellspacing="0" width="100%"
          style="max-width: 640px; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,0.1);">

          <!-- HEADER -->
          <tr>
            <td style="background-color: #1D1D1D; padding: 32px 28px 24px; text-align: center;">
              <img 
                src="https://i.imgur.com/rDZiNEZ.png" 
                alt="CV Djavacoal Indonesia" 
                width="160" 
                style="display:block; margin: 0 auto 12px;"
                />
              <h2 style="color: #ffffff; font-size: 20px; margin: 0;">📩 New Message from Website</h2>
              <p style="color: #EFA12D; margin: 6px 0 0; font-size: 14px;">Website Contact Form Notification</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="font-size: 15px; color: #444; margin-bottom: 20px;">
                You received a new contact message from your website:
              </p>

              <table cellpadding="0" cellspacing="0" width="100%" style="font-size: 15px; color: #222;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; width: 120px;">Full Name:</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${email}" style="color: #EFA12D; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Phone:</td>
                  <td style="padding: 8px 0;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Message:</td>
                  <td style="padding: 8px 0;">${message}</td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 28px 0;">

              <p style="font-size: 13px; color: #666;">
                This message was sent from the contact form on your website.
              </p>

              <a href="mailto:${email}"
                style="display: inline-block; background-color: #EFA12D; color: #1D1D1D; font-weight: 600;
                padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 14px;">
                Reply to ${name}
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #1D1D1D; text-align: center; padding: 18px 10px; color: #999; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} CV Djavacoal Indonesia — All Rights Reserved</p>
              <p style="margin: 4px 0 0; color: #EFA12D;">www.djavacoal.com</p>
            </td>
          </tr>
        </table>
      </div>
    `;

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
