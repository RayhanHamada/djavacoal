"use client";

import { useTranslations } from "next-intl";

import { ContactButton } from "../atoms/contact-button";
import { ContactInput } from "../atoms/contact-input";
import { ContactTextarea } from "../atoms/contact-textarea";

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
