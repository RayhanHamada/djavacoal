"use client";

import { useMemo } from "react";

import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

export interface ContactSettings {
    facebookLink: string | null;
    linkedinLink: string | null;
    instagramLink: string | null;
    tiktokLink: string | null;
    emailAddress: string | null;
    whatsappNumber: string | null;
    mapsLink: string | null;
    addressLine: string | null;
}

/**
 * Hook for managing contact settings (social media links and contact information)
 */
export function useContactSettings() {
    // Fetch contact settings
    const { data, isLoading } = useQuery(
        rpc.staticMedia.getContactSettings.queryOptions({
            input: {},
        })
    );

    // Save contact settings mutation
    const saveMutation = useMutation(
        rpc.staticMedia.saveContactSettings.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Contact settings saved successfully",
                    color: "green",
                });

                await client.invalidateQueries({
                    queryKey: rpc.staticMedia.getContactSettings.key({
                        input: {},
                    }),
                });
            },
            onError: () => {
                notifications.show({
                    title: "Error",
                    message: "Failed to save contact settings",
                    color: "red",
                });
            },
        })
    );

    const saveSettings = async (settings: ContactSettings) => {
        await saveMutation.mutateAsync({
            facebookLink: settings.facebookLink || "",
            linkedinLink: settings.linkedinLink || "",
            instagramLink: settings.instagramLink || "",
            tiktokLink: settings.tiktokLink || "",
            emailAddress: settings.emailAddress || "",
            whatsappNumber: settings.whatsappNumber || "",
            mapsLink: settings.mapsLink || "",
            addressLine: settings.addressLine || "",
        });
    };

    const settings = useMemo(
        () =>
            data || {
                facebookLink: null,
                linkedinLink: null,
                instagramLink: null,
                tiktokLink: null,
                emailAddress: null,
                whatsappNumber: null,
                mapsLink: null,
                addressLine: null,
            },
        [data]
    );

    return {
        settings,
        isLoading,
        saveSettings,
        isSaving: saveMutation.isPending,
    };
}
