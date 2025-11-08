# Contact Us Feature

## Overview

This feature provides the contact page where visitors can find company contact information and view an embedded map. It displays contact details with proper bilingual (EN/AR) support using `next-intl` for internationalization.

## Architecture

### Directory Structure

```
contact-us/
├── AGENTS.md           # This documentation file
├── index.ts            # Feature barrel export
└── components/
    ├── atoms/          # Basic UI elements
    │   ├── contact-button.tsx
    │   ├── contact-icon.tsx
    │   ├── contact-input.tsx
    │   ├── contact-textarea.tsx
    │   ├── index.ts
    │   └── social-button.tsx
    ├── molecules/      # Composite components
    │   ├── contact-form.tsx
    │   ├── contact-info-item.tsx
    │   ├── contact-map.tsx
    │   ├── contact-social.tsx
    │   └── index.ts
    └── organisms/      # Complex sections
        ├── contact-form-section.tsx
        ├── contact-section.tsx
        └── index.ts
```

## Features

### Core Functionality

1. **Contact Information Display**
   - Company email address
   - Phone number
   - Physical location address
   - Bilingual support (EN/AR)
   - Icon-based visual presentation

2. **Contact Form** (UI Only - No Backend Integration Yet)
   - Full name field
   - Email field
   - Phone number field
   - Message textarea
   - Submit button
   - All fields use translation keys

3. **Office Location Map**
   - Embedded Google Maps iframe
   - Shows company location
   - Responsive layout

4. **Social Media Links**
   - Facebook
   - Instagram
   - LinkedIn
   - Icon-based buttons with hover effects

## Technical Implementation

### Component Structure

#### ContactSection (Organism)
Main section displaying company logo, contact information, and social links.

```typescript
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactSection() {
    const t = useTranslations("ContactUs");

    return (
        <section className="relative bg-[#1C1C1C] text-white">
            {/* Banner with page title */}
            <div className="relative h-48 w-full md:h-72">
                <Image src="/images/bg-banner-header.png" alt={t("page.bannerAlt")} />
                <h1>{t("page.title")}</h1>
            </div>

            {/* Logo and Contact Info */}
            <div className="mx-auto flex max-w-6xl flex-col">
                <Image src="/svgs/logoContactUs.svg" alt={t("info.logoAlt")} />
                
                <ContactInfoItem
                    icon={<FaEnvelope />}
                    label={t("info.email.label")}
                    value={t("info.email.value")}
                />
                <ContactInfoItem
                    icon={<FaPhoneAlt />}
                    label={t("info.phone.label")}
                    value={t("info.phone.value")}
                />
                <ContactInfoItem
                    icon={<FaMapMarkerAlt />}
                    label={t("info.location.label")}
                    value={t("info.location.value")}
                />
                <ContactSocial />
            </div>
        </section>
    );
}
```

#### ContactFormSection (Organism)
Container for the map and contact form side-by-side layout.

```typescript
export function ContactFormSection() {
    return (
        <section className="bg-[#1C1C1C] pb-10 text-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
                <div className="flex-1">
                    <ContactMap />
                </div>
                <div className="flex-1">
                    <ContactForm />
                </div>
            </div>
        </section>
    );
}
```

#### ContactForm (Molecule)
Form component with all input fields using translations.

```typescript
"use client";

import { useTranslations } from "next-intl";

export function ContactForm() {
    const t = useTranslations("ContactUs.form");

    return (
        <form className="flex w-full flex-col gap-4">
            <ContactInput
                label={t("fields.fullName.label")}
                placeholder={t("fields.fullName.placeholder")}
            />
            <ContactInput
                label={t("fields.email.label")}
                type="email"
                placeholder={t("fields.email.placeholder")}
            />
            <ContactInput
                label={t("fields.phone.label")}
                placeholder={t("fields.phone.placeholder")}
            />
            <ContactTextarea
                label={t("fields.message.label")}
                placeholder={t("fields.message.placeholder")}
            />
            <div className="mt-2">
                <ContactButton text={t("submit")} />
            </div>
        </form>
    );
}
```

#### ContactInfoItem (Molecule)
Reusable component for displaying contact information with icons.

```typescript
interface ContactInfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

export function ContactInfoItem({ icon, label, value }: ContactInfoItemProps) {
    return (
        <div>
            <div className="flex items-start gap-3">
                <div className="text-secondary text-xl">{icon}</div>
                <div>
                    <p className="text-secondary font-semibold">{label}</p>
                </div>
            </div>
            <p className="text-sm text-gray-300">{value}</p>
        </div>
    );
}
```

#### ContactMap (Molecule)
Embedded Google Maps iframe showing company location.

```typescript
export function ContactMap() {
    return (
        <iframe
            src="https://www.google.com/maps/embed?..."
            className="h-full w-full rounded-lg"
            loading="lazy"
        />
    );
}
```

#### ContactSocial (Molecule)
Social media buttons with icons.

```typescript
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const ContactSocial = () => (
    <div className="flex gap-3">
        <SocialButton href="#" icon={<FaFacebookF />} />
        <SocialButton href="#" icon={<FaInstagram />} />
        <SocialButton href="#" icon={<FaLinkedinIn />} />
    </div>
);
```

## i18n Implementation

### Translation Structure

**English (`/src/i18n/messages/en.json`):**

```json
{
  "ContactUs": {
    "page": {
      "title": "Contact Us",
      "bannerAlt": "Contact Us Banner"
    },
    "info": {
      "email": {
        "label": "E-Mail",
        "value": "admin@djavacoal.com"
      },
      "phone": {
        "label": "Phone",
        "value": "+62 821-2285-9318"
      },
      "location": {
        "label": "Location",
        "value": "Jl. Vihara Jin Ku Poh Kp. Jati RT.002 RW.006 Tonjong, Tajurhalang, Bogor Regency, West Java 16320"
      },
      "logoAlt": "Djavacoal Logo"
    },
    "form": {
      "title": "Send us a message",
      "fields": {
        "fullName": {
          "label": "Full Name:",
          "placeholder": "Full Name"
        },
        "email": {
          "label": "E-mail:",
          "placeholder": "E-mail"
        },
        "phone": {
          "label": "Phone Number:",
          "placeholder": "Phone Number"
        },
        "message": {
          "label": "Message:",
          "placeholder": "Message"
        }
      },
      "submit": "Send",
      "submitting": "Sending...",
      "success": "Thank you! We'll get back to you soon.",
      "error": "Failed to send message. Please try again."
    },
    "map": {
      "title": "Our Location",
      "loadingError": "Failed to load map"
    },
    "social": {
      "title": "Follow Us",
      "facebook": "Facebook",
      "instagram": "Instagram",
      "linkedin": "LinkedIn"
    }
  }
}
```

**Arabic (`/src/i18n/messages/ar.json`):**

```json
{
  "ContactUs": {
    "page": {
      "title": "اتصل بنا",
      "bannerAlt": "لافتة اتصل بنا"
    },
    "info": {
      "email": {
        "label": "البريد الإلكتروني",
        "value": "admin@djavacoal.com"
      },
      "phone": {
        "label": "الهاتف",
        "value": "+62 821-2285-9318"
      },
      "location": {
        "label": "الموقع",
        "value": "Jl. Vihara Jin Ku Poh Kp. Jati RT.002 RW.006 Tonjong, Tajurhalang, Bogor Regency, West Java 16320"
      },
      "logoAlt": "شعار ديافاكوال"
    },
    "form": {
      "title": "أرسل لنا رسالة",
      "fields": {
        "fullName": {
          "label": "الاسم الكامل:",
          "placeholder": "الاسم الكامل"
        },
        "email": {
          "label": "البريد الإلكتروني:",
          "placeholder": "البريد الإلكتروني"
        },
        "phone": {
          "label": "رقم الهاتف:",
          "placeholder": "رقم الهاتف"
        },
        "message": {
          "label": "الرسالة:",
          "placeholder": "الرسالة"
        }
      },
      "submit": "إرسال",
      "submitting": "جارٍ الإرسال...",
      "success": "شكراً لك! سنتواصل معك قريباً.",
      "error": "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى."
    },
    "map": {
      "title": "موقعنا",
      "loadingError": "فشل تحميل الخريطة"
    },
    "social": {
      "title": "تابعنا",
      "facebook": "فيسبوك",
      "instagram": "إنستغرام",
      "linkedin": "لينكدإن"
    }
  }
}
```

### Usage in Components

All text displayed to users must use the `useTranslations` hook:

```typescript
"use client";

import { useTranslations } from "next-intl";

export function YourComponent() {
    const t = useTranslations("ContactUs");
    
    return <h1>{t("page.title")}</h1>;
}
```

## Page Integration

### Contact Page Route
Located at `/app/(visitor)/contact-us/page.tsx`:

```typescript
import { ContactFormSection } from "@/features/contact-us";
import ContactSection from "@/features/contact-us/components/organism/contact-section";

export default function ContactUsPage() {
    return (
        <main>
            <ContactSection />
            <ContactFormSection />
        </main>
    );
}
```

### Layout
Uses `VisitorLayout` component from `@/components/layouts` which provides:
- Header with navigation
- Footer with contact info
- Locale switcher
- Responsive design

## Dependencies

### External Packages
- `next-intl` - Internationalization
- `react-icons/fa` - Font Awesome icons
- `next/image` - Optimized images

### Internal Dependencies
- `@/components/layouts/visitor-layout` - Page layout wrapper
- `@/hooks/use-app-locale` - Current locale detection

## Styling

### Design System
- Background: `bg-[#1C1C1C]` (dark theme)
- Text: White with gray-300 for secondary text
- Accent: Orange for buttons and highlights
- Layout: Max-width 6xl container with responsive padding

### Responsive Breakpoints
- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

## Accessibility

- Semantic HTML structure
- Proper form labels
- Alt text for all images
- Icon labels for screen readers
- Keyboard navigation support
- Focus indicators on interactive elements

## Best Practices for AI Agents

### When Adding Features
1. **Always use translations**: Never hardcode user-facing text
2. **Update both EN and AR**: Add keys to both message files
3. **Use "use client"**: Components using `useTranslations` must be client components
4. **Follow atomic design**: Place components in correct atoms/molecules/organisms folder
5. **Export via index.ts**: Add new components to barrel exports

### When Modifying
1. **Update translations first**: Add/modify translation keys before updating components
2. **Test both locales**: Verify text displays correctly in English and Arabic
3. **Maintain responsive design**: Test on mobile, tablet, and desktop
4. **Keep styling consistent**: Use existing Tailwind classes and color scheme
5. **Update AGENTS.md**: Document any architectural changes

### When Debugging
1. **Check translation keys**: Verify keys exist in both en.json and ar.json
2. **Console errors**: Look for missing translation key warnings
3. **Client vs Server**: Ensure "use client" directive is present when needed
4. **Import paths**: Use `@/` alias for absolute imports
5. **Barrel exports**: Verify components are exported via index.ts files

## Current Limitations

### Form Functionality
⚠️ **The contact form is currently UI-only**. It does not:
- Validate inputs
- Submit data to a backend
- Send emails
- Store inquiries in database
- Show success/error messages

### To Implement Form Submission

You would need to:

1. **Add Zod validation schema** in `server/` folder:
```typescript
import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});
```

2. **Create RPC function** for form submission:
```typescript
import { base } from "@/lib/orpc/server";
import { getResend } from "@/adapters/email-service";

export const submitContactForm = base
  .input(ContactFormSchema)
  .handler(async function ({ context: { env }, input }) {
    const resend = getResend(env.RESEND_API_KEY);
    
    await resend.emails.send({
      to: env.CONTACT_EMAIL || "admin@djavacoal.com",
      from: env.SENDER_EMAIL,
      subject: "New Contact Form Submission",
      html: `<p>Name: ${input.name}</p>
             <p>Email: ${input.email}</p>
             <p>Phone: ${input.phone || "N/A"}</p>
             <p>Message: ${input.message}</p>`
    });
    
    return { success: true };
  })
  .callable();
```

3. **Update ContactForm component** to handle submission:
```typescript
"use client";

import { useForm } from "@mantine/form";
import { rpc } from "@/lib/rpc";
import { notifications } from "@mantine/notifications";

export function ContactForm() {
    const t = useTranslations("ContactUs.form");
    const mutation = rpc.contact.submitContactForm.useMutation();
    
    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            message: ""
        }
    });
    
    const handleSubmit = form.onSubmit(async (values) => {
        try {
            await mutation.mutateAsync(values);
            notifications.show({
                title: "Success",
                message: t("success"),
                color: "green"
            });
            form.reset();
        } catch (error) {
            notifications.show({
                title: "Error",
                message: t("error"),
                color: "red"
            });
        }
    });
    
    return <form onSubmit={handleSubmit}>...</form>;
}
```

4. **Register router** in `src/adapters/rpc/index.ts`:
```typescript
import { router as contact } from "@/features/contact-us/server/router";

const router = {
    contact,
    // ... other routers
};
```

## Related Features

- **home** - Homepage may have contact CTA buttons
- **our-products** - Product inquiry links may redirect to contact page
- **about-company** - Company information with contact details
- **Footer** - Global footer displays contact information on all pages

## Future Enhancements

Potential additions to consider:

- [ ] **Form backend integration** - Email sending or database storage
- [ ] **Form validation** - Client and server-side validation
- [ ] **Success/error handling** - User feedback after submission
- [ ] **reCAPTCHA** - Spam protection
- [ ] **WhatsApp integration** - Click-to-chat button
- [ ] **Live chat widget** - Real-time support
- [ ] **FAQ section** - Common questions before contact
- [ ] **Callback request** - Schedule a call feature
- [ ] **File attachments** - Support for RFQs with documents
- [ ] **Multi-language map** - Localized Google Maps
- [ ] **Business hours** - Display operating hours
- [ ] **Multiple offices** - Branch selector if company expands

## SEO Considerations

Add metadata to the page route for better search engine optimization:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Djavacoal Indonesia",
  description: "Get in touch with Djavacoal Indonesia for premium coconut charcoal briquettes. Visit our office in Bogor, West Java or send us a message.",
  keywords: ["contact", "Djavacoal", "charcoal supplier", "Indonesia", "Bogor"],
  openGraph: {
    title: "Contact Djavacoal Indonesia",
    description: "Reach out to us for inquiries about premium charcoal products",
    images: ["/images/og-contact.jpg"]
  }
};
```

## License

Part of the Djavacoal project. See main project LICENSE file.
