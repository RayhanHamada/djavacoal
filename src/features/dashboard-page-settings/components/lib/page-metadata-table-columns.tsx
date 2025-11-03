import { createColumnHelper } from "@tanstack/react-table";

import {
    KeywordsCell,
    MetadataDescriptionCell,
    MetadataTitleCell,
    PathCell,
} from "../atoms/page-metadata-table-cells";
import { PageMetadataTableActions } from "../molecules/page-metadata-table-actions";

export interface PageMetadataItem {
    id: number;
    path: string;
    metadata_title: string;
    metadata_description: string;
    metadata_keywords: string[];
    created_at: Date;
    updated_at: Date;
}

const columnHelper = createColumnHelper<PageMetadataItem>();

export const createPageMetadataTableColumns = (
    onEdit: (id: number) => void,
    onDelete: (id: number) => void
) => [
    columnHelper.accessor("path", {
        id: "path",
        header: "Path",
        cell: ({ row }) => <PathCell path={row.original.path} />,
        size: 200,
    }),
    columnHelper.accessor("metadata_title", {
        id: "metadata_title",
        header: "Title",
        cell: ({ row }) => (
            <MetadataTitleCell title={row.original.metadata_title} />
        ),
        size: 250,
    }),
    columnHelper.accessor("metadata_description", {
        id: "metadata_description",
        header: "Description",
        cell: ({ row }) => (
            <MetadataDescriptionCell
                description={row.original.metadata_description}
            />
        ),
        size: 300,
    }),
    columnHelper.accessor("metadata_keywords", {
        id: "metadata_keywords",
        header: "Keywords",
        cell: ({ row }) => (
            <KeywordsCell keywords={row.original.metadata_keywords} />
        ),
        size: 250,
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <PageMetadataTableActions
                id={row.original.id}
                path={row.original.path}
                onEdit={() => onEdit(row.original.id)}
                onDelete={() => onDelete(row.original.id)}
            />
        ),
        size: 100,
    }),
];
