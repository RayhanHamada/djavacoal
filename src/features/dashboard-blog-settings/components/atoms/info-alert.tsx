"use client";

import Link from "next/link";

import { ActionIcon, Alert, Button, Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCopy, IconInfoCircle } from "@tabler/icons-react";

import { UI_TEXT } from "@/features/dashboard-blog-settings/lib";

/**
 * InfoAlert - Atom component for displaying informational messages
 * Shows a styled alert with information about blog settings
 */
export function InfoAlert() {
    const sitemapURL = new URL(
        "/blog/sitemap.xml",
        process.env.NEXT_PUBLIC_BASE_URL
    ).toString();

    function handleCopyToClipboard() {
        navigator.clipboard.writeText(sitemapURL);
        notifications.show({
            title: "Copied to clipboard",
            message: "Sitemap URL has been copied to clipboard.",
            color: "green",
        });
    }

    return (
        <Alert
            color="blue"
            variant="light"
            title={UI_TEXT.INFO_ALERT_TITLE}
            icon={<IconInfoCircle size={20} />}
        >
            <Text size="sm">{UI_TEXT.INFO_ALERT_MESSAGE}</Text>
            <br />
            <Flex gap="sm" align="center">
                <Button
                    component={Link}
                    href={sitemapURL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>See generated sitemap </span>
                </Button>
                <ActionIcon onClick={handleCopyToClipboard} h="100%">
                    <IconCopy size={20} />
                </ActionIcon>
            </Flex>
        </Alert>
    );
}
