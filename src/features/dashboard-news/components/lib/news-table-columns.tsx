import { Group } from "@mantine/core";
import { createColumnHelper } from "@tanstack/react-table";

import {
    NewsDateCell,
    NewsImageCell,
    NewsPinnedBadge,
    NewsStatusCell,
    NewsTitleCell,
} from "../atoms";
import { NewsTableActions } from "../molecules/news-table-actions";
import { NEWS_STATUS_FILTER_VALUES } from "@/features/dashboard-news/lib/constants";

export interface NewsArticle {
    id: number;
    slug: string;
    imageKey: string | null;
    metadataTitle: string;
    enTitle: string;
    arTitle: string;
    status: "draft" | "published" | "unpublished";
    publishedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    isPinnedToHome: boolean;
}

const columnHelper = createColumnHelper<NewsArticle>();

export const createNewsTableColumns = (onEdit: (id: number) => void) => [
    columnHelper.display({
        id: "image",
        header: "Image",
        cell: ({ row }) => (
            <NewsImageCell
                imageKey={row.original.imageKey}
                alt={row.original.enTitle}
            />
        ),
        size: 120,
    }),
    columnHelper.accessor("enTitle", {
        id: "title",
        header: "Title",
        cell: ({ row }) => (
            <NewsTitleCell
                enTitle={row.original.enTitle}
                arTitle={row.original.arTitle}
                onClick={() => onEdit(row.original.id)}
            />
        ),
    }),
    columnHelper.accessor("status", {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            const { status, publishedAt, isPinnedToHome } = row.original;
            const isScheduled =
                publishedAt &&
                publishedAt > new Date() &&
                status === NEWS_STATUS_FILTER_VALUES.PUBLISHED;

            return (
                <Group gap="xs" wrap="nowrap">
                    <NewsStatusCell
                        status={isScheduled ? "scheduled" : status}
                    />
                    <NewsPinnedBadge isPinned={isPinnedToHome} />
                </Group>
            );
        },
        size: 160,
    }),
    columnHelper.accessor("publishedAt", {
        id: "publishedAt",
        header: "Published Date",
        cell: ({ row }) => <NewsDateCell date={row.original.publishedAt} />,
        size: 150,
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <NewsTableActions
                id={row.original.id}
                slug={row.original.slug}
                title={row.original.enTitle}
                status={row.original.status}
                publishedAt={row.original.publishedAt}
                isPinnedToHome={row.original.isPinnedToHome}
                onEdit={() => onEdit(row.original.id)}
            />
        ),
        size: 100,
    }),
];
