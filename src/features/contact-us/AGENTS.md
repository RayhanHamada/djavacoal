# Contact Us Feature

## Overview

This feature provides the contact page where visitors can find company contact information and submit inquiries. It includes contact details, a contact form, office location map, and social media links. Form submissions can be processed via email or saved to database for later review.

## Architecture

### Directory Structure

```
contact-us/
├── components/          # UI components for contact page
│   ├── atoms/          # Basic contact elements
│   ├── molecules/      # Composite components (contact card, form fields)
│   └── organisms/      # Complex sections (contact form, map, info section)
└── index.ts            # Feature barrel export
```

## Features

### Core Functionality

1. **Contact Information**
   - Company address
   - Phone numbers
   - Email addresses
   - Business hours
   - Bilingual display

2. **Contact Form**
   - Name, email, phone fields
   - Subject/inquiry type selector
   - Message textarea
   - Form validation
   - Submit functionality
   - Success/error feedback

3. **Office Location**
   - Interactive map (Google Maps, Mapbox, etc.)
   - Address display
   - Directions link

4. **Social Media Links**
   - Links to social profiles
   - Icons for each platform
   - Follow us section

5. **Alternative Contact Methods**
   - WhatsApp link
   - WeChat QR code
   - Telegram link
   - LinkedIn company page

## Technical Implementation

### Contact Form

```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

function ContactForm() {
  const form = useForm<ContactFormData>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    },
    validate: {
      name: (value) => value.length < 2 ? "Name too short" : null,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Invalid email",
      message: (value) => value.length < 10 ? "Message too short" : null
    }
  });
  
  const submitMutation = rpc.contact.submitInquiry.useMutation();
  
  const handleSubmit = form.onSubmit(async (values) => {
    await submitMutation.mutateAsync(values);
    form.reset();
  });
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### SEO Optimization

```typescript
export const metadata: Metadata = {
  title: "Contact Us - Djavacoal",
  description: "Get in touch with Djavacoal for inquiries and support",
  keywords: ["contact", "inquiry", "support", "address", "phone"],
};
```

### Bilingual Support

```typescript
import { useTranslations } from "next-intl";

function ContactInfo() {
  const t = useTranslations("contact");
  
  return (
    <Stack>
      <h2>{t("info.title")}</h2>
      <Text>{t("info.address")}</Text>
      <Text>{t("info.phone")}</Text>
      <Text>{t("info.email")}</Text>
    </Stack>
  );
}
```

## Components

### ContactFormSection
- Form fields (name, email, phone, subject, message)
- Validation feedback
- Submit button with loading state
- Success message
- Error handling

### ContactInfoCard
- Company address
- Phone numbers (clickable)
- Email addresses (clickable)
- Business hours
- Icon representations

### OfficeMapSection
- Embedded map (Google Maps iframe or Mapbox)
- Address overlay
- Directions button
- Zoom controls

### SocialMediaLinks
- Social media icons
- Platform links
- Follow us text
- Hover effects

### AlternativeContactMethods
- WhatsApp click-to-chat
- WeChat QR code
- Telegram link
- Additional messaging apps

## Integration Points

### Contact Page Route
Located at `/app/(visitor)/contact-us/page.tsx`:

```typescript
import { ContactUsView } from "@/features/contact-us";

export default function ContactUsPage() {
  return <ContactUsView />;
}
```

### Form Submission
Options for handling form submissions:

#### Option 1: Email via Resend
```typescript
// RPC function
export const submitInquiry = base
  .input(ContactFormSchema)
  .handler(async function ({ context: { env }, input }) {
    const resend = getResend(env.RESEND_API_KEY);
    
    await resend.emails.send({
      to: env.CONTACT_EMAIL,
      from: env.SENDER_EMAIL,
      subject: `New Inquiry: ${input.subject}`,
      react: <ContactInquiryEmail data={input} />
    });
  })
  .callable();
```

#### Option 2: Save to Database
```typescript
// Add inquiries table to schema
export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`)
});
```

### Navigation
- Header: Link to contact page
- Footer: Prominent contact link
- All pages: May have "Contact" CTA
- Uses `VisitorLayout` component

## Dependencies

### External Packages
- `@mantine/core`, `@mantine/form` - UI and form management
- `@mantine/notifications` - Success/error messages
- `react-google-maps` or `mapbox-gl` - Map integration
- `next-intl` - Internationalization
- `zod` - Schema validation

### Internal Dependencies
- `@/adapters/email-service` - Email sending (if used)
- `@/components/layouts/visitor-layout` - Layout wrapper
- `@/hooks/use-app-locale` - Current locale

## Usage Examples

### Contact Form Component

```typescript
export function ContactFormSection() {
  const t = useTranslations("contact.form");
  const form = useForm({...});
  
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label={t("name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        label={t("email")}
        type="email"
        {...form.getInputProps("email")}
      />
      <TextInput
        label={t("phone")}
        {...form.getInputProps("phone")}
      />
      <Select
        label={t("subject")}
        data={[
          { value: "inquiry", label: t("subjects.inquiry") },
          { value: "quote", label: t("subjects.quote") },
          { value: "support", label: t("subjects.support") }
        ]}
        {...form.getInputProps("subject")}
      />
      <Textarea
        label={t("message")}
        rows={5}
        {...form.getInputProps("message")}
      />
      <Button type="submit" loading={submitting}>
        {t("submit")}
      </Button>
    </form>
  );
}
```

## i18n Structure

Messages file structure (`/src/i18n/messages/en.json`):

```json
{
  "contact": {
    "title": "Contact Us",
    "info": {
      "title": "Get in Touch",
      "address": "123 Business Street, Jakarta, Indonesia",
      "phone": "+62 123 456 7890",
      "email": "info@djavacoal.com",
      "hours": "Monday - Friday: 9:00 AM - 5:00 PM"
    },
    "form": {
      "title": "Send us a message",
      "name": "Your Name",
      "email": "Email Address",
      "phone": "Phone Number (optional)",
      "subject": "Subject",
      "message": "Your Message",
      "submit": "Send Message",
      "success": "Thank you! We'll get back to you soon.",
      "error": "Failed to send message. Please try again."
    }
  }
}
```

## Form Validation

```typescript
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters")
});
```

## Best Practices for AI Agents

### When Adding Features
1. Implement spam protection (reCAPTCHA, honeypot)
2. Rate limit form submissions
3. Validate all inputs server-side
4. Send confirmation email to user
5. Store inquiries for admin review

### When Modifying
1. Update both EN and AR translations
2. Test form validation thoroughly
3. Ensure mobile-friendly form
4. Test email delivery
5. Handle errors gracefully

### When Debugging
1. Check email service configuration
2. Verify form validation rules
3. Test with various input scenarios
4. Check network request handling
5. Review error messages

## Accessibility

- Proper form labels
- Error messages announced
- Keyboard navigation
- Focus indicators
- ARIA attributes

## Performance Optimizations

1. **Form Handling**
   - Client-side validation before submission
   - Debounce validation
   - Loading states

2. **Map Loading**
   - Lazy load map iframe
   - Use static map image until interaction

3. **Email Sending**
   - Queue emails for batch processing
   - Return success before email sent

## Security Considerations

1. **Spam Prevention**
   - reCAPTCHA or hCaptcha
   - Honeypot field
   - Rate limiting
   - Email verification

2. **Input Validation**
   - Server-side validation
   - XSS prevention
   - SQL injection prevention
   - Email header injection prevention

3. **Data Protection**
   - Don't expose full contact email publicly
   - GDPR compliance for EU visitors
   - Clear privacy policy link

## Related Features

- **home** - May have contact CTA
- **our-products** - Product inquiry links to contact
- **about-company** - Company information
- **dashboard-auth** - Admin can view inquiries (if stored in DB)

## Future Enhancements

- [ ] Live chat widget
- [ ] FAQ section
- [ ] Callback request form
- [ ] File attachment support (for RFQs)
- [ ] Multi-step contact form
- [ ] Contact preference selection (email/phone)
- [ ] Appointment booking
- [ ] Branch office selector
- [ ] Inquiry tracking for users
- [ ] Auto-response emails

## License

Part of the Djavacoal project. See main project LICENSE file.
