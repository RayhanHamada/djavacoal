"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { ContactButton } from "../atoms/contact-button";
import { ContactInput } from "../atoms/contact-input";
import { ContactTextarea } from "../atoms/contact-textarea";

export function ContactForm() {
    const t = useTranslations("ContactUs.form");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<null | string>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        // 🧩 Validasi semua field harus diisi
        if (
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.message
        ) {
            setStatus("❌ Please fill in all fields before sending.");
            return;
        }

        // 🧩 Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus("❌ Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("✅ Message sent successfully!");
                setFormData({ name: "", email: "", phone: "", message: "" });

                setTimeout(() => {
                    setStatus(null);
                }, 3000);
            } else {
                setStatus("❌ Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setStatus("❌ Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-2 lg:gap-0"
        >
            <ContactInput
                label={t("fields.fullName.label")}
                placeholder={t("fields.fullName.placeholder")}
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <ContactInput
                label={t("fields.email.label")}
                type="email"
                placeholder={t("fields.email.placeholder")}
                name="email"
                value={formData.email}
                onChange={handleChange}
            />
            <ContactInput
                label={t("fields.phone.label")}
                placeholder={t("fields.phone.placeholder")}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
            />
            <ContactTextarea
                label={t("fields.message.label")}
                placeholder={t("fields.message.placeholder")}
                name="message"
                value={formData.message}
                onChange={handleChange}
            />
            <div className="mt-2">
                <ContactButton
                    text={loading ? "Sending..." : t("submit")}
                    disabled={loading}
                />
            </div>

            {status && (
                <p
                    className={`mt-3 text-sm ${
                        status.startsWith("✅")
                            ? "text-green-400"
                            : "text-red-400"
                    }`}
                >
                    {status}
                </p>
            )}
        </form>
    );
}
