import { createColumnHelper } from "@tanstack/react-table";

import {
    NewsDateCell,
    NewsImageCell,
    NewsStatusCell,
    NewsTitleCell,
} from "../atoms/news-table-cells";
import { NewsTableActions } from "../molecules/news-table-actions";

export interface NewsArticle {
    id: number;
    slug: string;
    imageKey: string | null;
    metadataTitle: string;
    enTitle: string;
    arTitle: string;
    isPublished: boolean;
    publishedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
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
    columnHelper.accessor("isPublished", {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
            <NewsStatusCell isPublished={row.original.isPublished} />
        ),
        size: 120,
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
                isPublished={row.original.isPublished}
                onEdit={() => onEdit(row.original.id)}
            />
        ),
        size: 100,
    }),
];
