"use client";

import { Badge, Tooltip } from "@mantine/core";
import { IconPin } from "@tabler/icons-react";

interface NewsPinnedBadgeProps {
    /**
     * Whether the badge should be shown
     */
    isPinned: boolean;
}

/**
 * Badge component to indicate a news article is pinned to the home page
 */
export function NewsPinnedBadge({ isPinned }: NewsPinnedBadgeProps) {
    if (!isPinned) {
        return null;
    }

    return (
        <Tooltip label="Pinned to home page" withArrow>
            <Badge
                size="xs"
                variant="light"
                color="orange"
                leftSection={<IconPin size={12} />}
            >
                Pinned
            </Badge>
        </Tooltip>
    );
}
