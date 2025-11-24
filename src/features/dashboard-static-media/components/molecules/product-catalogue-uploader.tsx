"use client";

import { Alert, Button, FileButton, Group, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconDownload,
    IconInfoCircle,
    IconTrash,
    IconUpload,
} from "@tabler/icons-react";

import {
    EmptyState,
    PdfFileInfo,
    SectionHeader,
} from "@/features/dashboard-static-media/components/atoms";
import { useProductCatalogue } from "@/features/dashboard-static-media/hooks";
import {
    CATALOGUE_EMPTY_DESCRIPTION,
    CATALOGUE_EMPTY_TITLE,
    CATALOGUE_FILE_NAME,
    FILE_REQUIREMENTS,
    ICON_SIZE,
    PDF_MIME_TYPE,
    showDeleteErrorNotification,
    showDeleteLoadingNotification,
    showDeleteSuccessNotification,
    showUploadErrorNotification,
    showUploadLoadingNotification,
    showUploadSuccessNotification,
    validatePdfFile,
} from "@/features/dashboard-static-media/lib";

interface ProductCatalogueUploaderProps {
    title: string;
    description: string;
}

/**
 * ProductCatalogueUploader - Molecule component for managing product catalogue PDF
 */
export function ProductCatalogueUploader({
    title,
    description,
}: ProductCatalogueUploaderProps) {
    const {
        catalogue,
        isLoading,
        isUploading,
        isDeleting,
        saveCatalogue,
        deleteCatalogue,
    } = useProductCatalogue();

    const handleFileSelect = async (file: File | null) => {
        if (!file) return;

        // Validate file
        const validation = validatePdfFile(file);
        if (!validation.isValid) {
            notifications.show({
                title: validation.error!.title,
                message: validation.error!.message,
                color: "red",
            });
            return;
        }

        try {
            showUploadLoadingNotification();
            await saveCatalogue(file);
            showUploadSuccessNotification();
        } catch (error) {
            showUploadErrorNotification(
                error instanceof Error ? error : undefined
            );
        }
    };

    const handleDelete = async () => {
        if (!catalogue.fileKey) return;

        try {
            showDeleteLoadingNotification();
            await deleteCatalogue();
            showDeleteSuccessNotification();
        } catch {
            showDeleteErrorNotification();
        }
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

            <Alert
                color="blue"
                variant="light"
                icon={<IconInfoCircle size={ICON_SIZE.SMALL} />}
                title="File Requirements"
            >
                <Stack gap={4}>
                    {FILE_REQUIREMENTS.map((requirement, index) => (
                        <Text key={index} size="sm">
                            • {requirement}
                        </Text>
                    ))}
                </Stack>
            </Alert>

            {!catalogue.fileKey ? (
                <>
                    <EmptyState
                        title={CATALOGUE_EMPTY_TITLE}
                        description={CATALOGUE_EMPTY_DESCRIPTION}
                    />
                    <FileButton
                        onChange={handleFileSelect}
                        accept={PDF_MIME_TYPE}
                        disabled={isUploading}
                    >
                        {(props) => (
                            <Button
                                {...props}
                                leftSection={
                                    <IconUpload size={ICON_SIZE.SMALL} />
                                }
                                loading={isUploading}
                                size="md"
                            >
                                Upload Catalogue
                            </Button>
                        )}
                    </FileButton>
                </>
            ) : (
                <Stack gap="md">
                    <PdfFileInfo
                        fileName={CATALOGUE_FILE_NAME}
                        fileUrl={catalogue.fileUrl || undefined}
                    />

                    <Group>
                        {catalogue.fileUrl && (
                            <Button
                                component="a"
                                href={catalogue.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                leftSection={
                                    <IconDownload size={ICON_SIZE.SMALL} />
                                }
                                variant="light"
                            >
                                Download
                            </Button>
                        )}
                        <FileButton
                            onChange={handleFileSelect}
                            accept={PDF_MIME_TYPE}
                            disabled={isUploading || isDeleting}
                        >
                            {(props) => (
                                <Button
                                    {...props}
                                    leftSection={
                                        <IconUpload size={ICON_SIZE.SMALL} />
                                    }
                                    variant="light"
                                    loading={isUploading}
                                >
                                    Replace Catalogue
                                </Button>
                            )}
                        </FileButton>
                        <Button
                            leftSection={<IconTrash size={ICON_SIZE.SMALL} />}
                            color="red"
                            variant="light"
                            onClick={handleDelete}
                            disabled={isUploading || isDeleting}
                            loading={isDeleting}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            )}
        </Stack>
    );
}
