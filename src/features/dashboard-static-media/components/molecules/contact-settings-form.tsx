"use client";

import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    Group,
    Stack,
    Text,
    TextInput,
    Textarea,
} from "@mantine/core";
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTiktok,
    IconBrandWhatsapp,
    IconDeviceFloppy,
    IconMail,
    IconMapPin,
} from "@tabler/icons-react";

import { SectionHeader } from "@/features/dashboard-static-media/components/atoms";
import {
    ContactSettings,
    useContactSettings,
} from "@/features/dashboard-static-media/hooks";

interface ContactSettingsFormProps {
    title: string;
    description: string;
}

/**
 * ContactSettingsForm - Molecule component for managing social media links and contact information
 */
export function ContactSettingsForm({
    title,
    description,
}: ContactSettingsFormProps) {
    const { settings, isLoading, saveSettings, isSaving } =
        useContactSettings();

    const [formData, setFormData] = useState<ContactSettings>({
        facebookLink: "",
        linkedinLink: "",
        instagramLink: "",
        tiktokLink: "",
        emailAddress: "",
        whatsappNumber: "",
        mapsLink: "",
        addressLine: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (settings) {
            setFormData({
                facebookLink: settings.facebookLink || "",
                linkedinLink: settings.linkedinLink || "",
                instagramLink: settings.instagramLink || "",
                tiktokLink: settings.tiktokLink || "",
                emailAddress: settings.emailAddress || "",
                whatsappNumber: settings.whatsappNumber || "",
                mapsLink: settings.mapsLink || "",
                addressLine: settings.addressLine || "",
            });
        }
    }, [settings]);

    const validateUrl = (url: string): boolean => {
        if (!url.trim()) return true; // Empty is valid
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateEmail = (email: string): boolean => {
        if (!email.trim()) return true; // Empty is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate URLs
        if (formData.facebookLink && !validateUrl(formData.facebookLink)) {
            newErrors.facebookLink = "Invalid URL";
        }
        if (formData.linkedinLink && !validateUrl(formData.linkedinLink)) {
            newErrors.linkedinLink = "Invalid URL";
        }
        if (formData.instagramLink && !validateUrl(formData.instagramLink)) {
            newErrors.instagramLink = "Invalid URL";
        }
        if (formData.tiktokLink && !validateUrl(formData.tiktokLink)) {
            newErrors.tiktokLink = "Invalid URL";
        }
        if (formData.mapsLink && !validateUrl(formData.mapsLink)) {
            newErrors.mapsLink = "Invalid URL";
        }

        // Validate email
        if (formData.emailAddress && !validateEmail(formData.emailAddress)) {
            newErrors.emailAddress = "Invalid email address";
        }

        // Validate address line character limit
        if (formData.addressLine && formData.addressLine.length > 500) {
            newErrors.addressLine = "Address line must not exceed 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        await saveSettings(formData);
    };

    if (isLoading) {
        return (
            <Stack gap="md">
                <SectionHeader title={title} description={description} />
                <Text size="sm" c="dimmed">
                    Loading...
                </Text>
            </Stack>
        );
    }

    return (
        <Stack gap="md">
            <SectionHeader title={title} description={description} />

            <Alert color="blue" variant="light" title="Information">
                <Text size="sm">
                    All fields are optional. Leave empty if not applicable.
                </Text>
            </Alert>

            {/* Social Media Links Group */}
            <Stack gap="md">
                <Text size="sm" fw={600} c="dimmed">
                    Social Media Links
                </Text>

                <TextInput
                    label="Facebook"
                    placeholder="https://facebook.com/yourpage"
                    value={formData.facebookLink || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, facebookLink: e.target.value })
                    }
                    leftSection={<IconBrandFacebook size={18} />}
                    disabled={isSaving}
                    error={errors.facebookLink}
                />

                <TextInput
                    label="LinkedIn"
                    placeholder="https://linkedin.com/company/yourcompany"
                    value={formData.linkedinLink || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, linkedinLink: e.target.value })
                    }
                    leftSection={<IconBrandLinkedin size={18} />}
                    disabled={isSaving}
                    error={errors.linkedinLink}
                />

                <TextInput
                    label="Instagram"
                    placeholder="https://instagram.com/yourprofile"
                    value={formData.instagramLink || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            instagramLink: e.target.value,
                        })
                    }
                    leftSection={<IconBrandInstagram size={18} />}
                    disabled={isSaving}
                    error={errors.instagramLink}
                />

                <TextInput
                    label="TikTok"
                    placeholder="https://tiktok.com/@yourprofile"
                    value={formData.tiktokLink || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, tiktokLink: e.target.value })
                    }
                    leftSection={<IconBrandTiktok size={18} />}
                    disabled={isSaving}
                    error={errors.tiktokLink}
                />
            </Stack>

            {/* Contact Information Group */}
            <Stack gap="md" mt="lg">
                <Text size="sm" fw={600} c="dimmed">
                    Contact Information
                </Text>

                <TextInput
                    label="Email Address"
                    placeholder="contact@example.com"
                    value={formData.emailAddress || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            emailAddress: e.target.value,
                        })
                    }
                    leftSection={<IconMail size={18} />}
                    disabled={isSaving}
                    error={errors.emailAddress}
                />

                <TextInput
                    label="WhatsApp Number"
                    placeholder="+1234567890"
                    value={formData.whatsappNumber || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            whatsappNumber: e.target.value,
                        })
                    }
                    leftSection={<IconBrandWhatsapp size={18} />}
                    disabled={isSaving}
                />

                <TextInput
                    label="Maps Link"
                    placeholder="https://maps.google.com/?q=your+location"
                    value={formData.mapsLink || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, mapsLink: e.target.value })
                    }
                    leftSection={<IconMapPin size={18} />}
                    disabled={isSaving}
                    error={errors.mapsLink}
                />

                <Textarea
                    label="Address Line"
                    placeholder="Enter your full address"
                    value={formData.addressLine || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, addressLine: e.target.value })
                    }
                    disabled={isSaving}
                    error={errors.addressLine}
                    maxLength={500}
                    rows={3}
                    description={`${formData.addressLine?.length || 0}/500 characters`}
                />
            </Stack>

            <Group mt="md">
                <Button
                    leftSection={<IconDeviceFloppy size={18} />}
                    onClick={handleSave}
                    loading={isSaving}
                >
                    Save Contact Settings
                </Button>
            </Group>
        </Stack>
    );
}
