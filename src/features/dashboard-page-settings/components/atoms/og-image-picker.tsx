"use client";

import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

import {
    ActionIcon,
    AspectRatio,
    Box,
    Button,
    Card,
    Center,
    FileButton,
    Group,
    Image,
    Loader,
    Modal,
    Pagination,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconPhoto,
    IconSearch,
    IconTrash,
    IconUpload,
    IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "ahooks";

import {
    OG_IMAGE_ALLOWED_MIME_TYPES,
    OG_IMAGE_MAX_FILE_SIZE,
} from "@/features/dashboard-page-settings/lib/constants";
import { client, rpc } from "@/lib/rpc";

interface OgImagePickerProps {
    /** Current OG image key (from R2) */
    value: string | null | undefined;
    /** Callback when image is selected or removed */
    onChange: (key: string | null) => void;
    /** Whether the picker is disabled */
    disabled?: boolean;
}

/**
 * Ref handle for OgImagePicker component
 */
export interface OgImagePickerRef {
    /** Upload the currently held file. Returns the R2 key or null if no pending file */
    uploadPendingFile: () => Promise<string | null>;
    /** Check if there's a pending file to upload */
    hasPendingFile: () => boolean;
}

/**
 * Builds a URL for displaying the OG image from R2
 */
function getOgImageUrl(key: string): string {
    return `${process.env.NEXT_PUBLIC_ASSET_URL}${key}`;
}

/**
 * OgImagePicker - Atom component for selecting OpenGraph images
 *
 * Supports two methods:
 * 1. Direct upload via FileButton (deferred until form submit)
 * 2. Selection from gallery via modal picker
 *
 * Displays current image preview with options to change or remove.
 * Uses forwardRef to expose upload functionality to parent.
 */
export const OgImagePicker = forwardRef<OgImagePickerRef, OgImagePickerProps>(
    function OgImagePicker({ value, onChange, disabled = false }, ref) {
        const [modalOpened, setModalOpened] = useState(false);
        const [pendingFile, setPendingFile] = useState<File | null>(null);
        const [previewUrl, setPreviewUrl] = useState<string | null>(null);

        // Expose upload function to parent via ref
        useImperativeHandle(ref, () => ({
            uploadPendingFile: async () => {
                if (!pendingFile) {
                    // No pending file - return existing key
                    return value || null;
                }

                // Upload the pending file
                const { uploadUrl, key } =
                    await client.pageSettings.generateOgImageUploadUrl({
                        fileName: pendingFile.name,
                        contentType: pendingFile.type,
                        fileSize: pendingFile.size,
                    });

                const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    body: pendingFile,
                    headers: {
                        "Content-Type": pendingFile.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image to storage");
                }

                // Clean up preview URL
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }

                // Clear pending state
                setPendingFile(null);
                setPreviewUrl(null);

                return key;
            },
            hasPendingFile: () => pendingFile !== null,
        }));

        const handleGallerySelect = (photo: { key: string }) => {
            // Clear any pending file when selecting from gallery
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setPendingFile(null);
            onChange(photo.key);
            setModalOpened(false);
        };

        const handleRemove = () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setPendingFile(null);
            onChange(null);
        };

        const handleFileSelect = useCallback(
            (file: File | null) => {
                if (!file) return;

                // Validate file type
                if (
                    !OG_IMAGE_ALLOWED_MIME_TYPES.includes(
                        file.type as (typeof OG_IMAGE_ALLOWED_MIME_TYPES)[number]
                    )
                ) {
                    notifications.show({
                        title: "Invalid file type",
                        message:
                            "Please upload a JPEG, PNG, GIF, or WebP image",
                        color: "red",
                        position: "bottom-center",
                    });
                    return;
                }

                // Validate file size
                if (file.size > OG_IMAGE_MAX_FILE_SIZE) {
                    notifications.show({
                        title: "File too large",
                        message: "Image must be less than 10MB",
                        color: "red",
                        position: "bottom-center",
                    });
                    return;
                }

                // Clean up previous preview URL
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }

                // Create local preview and store file for later upload
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                setPendingFile(file);

                // Clear any existing R2 key since we have a new pending file
                onChange(null);
            },
            [onChange, previewUrl]
        );

        // Determine what image to show: pending file preview, existing R2 image, or nothing
        const displayUrl = previewUrl || (value ? getOgImageUrl(value) : null);
        const isDisabled = disabled;

        return (
            <Stack gap="xs">
                <Text size="sm" fw={500}>
                    OpenGraph Image
                </Text>
                <Text size="xs" c="dimmed">
                    Image displayed when sharing on social media (recommended:
                    1200×630px)
                </Text>

                {displayUrl ? (
                    <Card withBorder p="xs" radius="md">
                        <Stack gap="xs">
                            <AspectRatio ratio={1200 / 630}>
                                <Image
                                    src={displayUrl}
                                    alt="OpenGraph preview"
                                    fit="cover"
                                    radius="sm"
                                />
                            </AspectRatio>
                            {pendingFile && (
                                <Text size="xs" c="dimmed" ta="center">
                                    Pending upload: {pendingFile.name}
                                </Text>
                            )}
                            <Group gap="xs">
                                <FileButton
                                    onChange={handleFileSelect}
                                    accept={OG_IMAGE_ALLOWED_MIME_TYPES.join(
                                        ","
                                    )}
                                    disabled={isDisabled}
                                >
                                    {(props) => (
                                        <Button
                                            {...props}
                                            variant="light"
                                            size="xs"
                                            leftSection={
                                                <IconUpload size={14} />
                                            }
                                            disabled={isDisabled}
                                        >
                                            Upload
                                        </Button>
                                    )}
                                </FileButton>
                                <Button
                                    variant="light"
                                    size="xs"
                                    leftSection={<IconPhoto size={14} />}
                                    onClick={() => setModalOpened(true)}
                                    disabled={isDisabled}
                                    flex={1}
                                >
                                    Gallery
                                </Button>
                                <Button
                                    variant="light"
                                    color="red"
                                    size="xs"
                                    leftSection={<IconTrash size={14} />}
                                    onClick={handleRemove}
                                    disabled={isDisabled}
                                >
                                    Remove
                                </Button>
                            </Group>
                        </Stack>
                    </Card>
                ) : (
                    <Group gap="xs">
                        <FileButton
                            onChange={handleFileSelect}
                            accept={OG_IMAGE_ALLOWED_MIME_TYPES.join(",")}
                            disabled={isDisabled}
                        >
                            {(props) => (
                                <Button
                                    {...props}
                                    variant="light"
                                    leftSection={<IconUpload size={16} />}
                                    disabled={isDisabled}
                                >
                                    Upload Image
                                </Button>
                            )}
                        </FileButton>
                        <Button
                            variant="light"
                            leftSection={<IconPhoto size={16} />}
                            onClick={() => setModalOpened(true)}
                            disabled={isDisabled}
                        >
                            Choose from Gallery
                        </Button>
                    </Group>
                )}

                <OgImagePickerModal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    onSelect={handleGallerySelect}
                />
            </Stack>
        );
    }
);

interface OgImagePickerModalProps {
    opened: boolean;
    onClose: () => void;
    onSelect: (photo: { id: string; name: string; key: string }) => void;
}

/**
 * Modal for selecting an OG image from the gallery
 */
function OgImagePickerModal({
    opened,
    onClose,
    onSelect,
}: OgImagePickerModalProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, { wait: 500 });

    const photosQuery = useQuery(
        rpc.gallery.listPhotos.queryOptions({
            enabled: opened,
            input: {
                search: debouncedSearch,
                page,
                limit: 12,
                sortBy: "updated_at",
                sortOrder: "desc",
            },
        })
    );

    const photos = photosQuery.data?.photos ?? [];
    const totalPages = photosQuery.data?.totalPages ?? 1;

    const handlePhotoClick = (photo: Record<string, unknown>) => {
        onSelect({
            id: photo.id as string,
            name: photo.name as string,
            key: photo.key as string,
        });
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="lg"
            title={
                <Group gap="xs">
                    <IconPhoto size={20} />
                    <Text size="md" fw={600}>
                        Select OpenGraph Image
                    </Text>
                </Group>
            }
            padding="md"
        >
            <Stack gap="md">
                <TextInput
                    placeholder="Search photos..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.currentTarget.value);
                        setPage(1);
                    }}
                    leftSection={<IconSearch size={16} />}
                    rightSection={
                        search && (
                            <ActionIcon
                                variant="transparent"
                                size="sm"
                                onClick={() => setSearch("")}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        )
                    }
                />

                <Box mih={300}>
                    {photosQuery.isLoading ? (
                        <Center h={300}>
                            <Loader size="md" />
                        </Center>
                    ) : photosQuery.isError ? (
                        <Center h={300}>
                            <Text c="red" size="sm">
                                Error loading photos
                            </Text>
                        </Center>
                    ) : photos.length === 0 ? (
                        <Center h={300}>
                            <Text c="dimmed" size="sm">
                                {search
                                    ? "No photos found"
                                    : "No photos available. Upload photos in the Gallery page first."}
                            </Text>
                        </Center>
                    ) : (
                        <SimpleGrid cols={3} spacing="sm">
                            {photos.map((photo: Record<string, unknown>) => (
                                <Card
                                    key={photo.id as string}
                                    shadow="xs"
                                    padding="xs"
                                    radius="sm"
                                    withBorder
                                    style={{
                                        cursor: "pointer",
                                        transition: "transform 0.15s",
                                    }}
                                    onClick={() => handlePhotoClick(photo)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1.02)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1)";
                                    }}
                                >
                                    <AspectRatio ratio={1200 / 630}>
                                        <Image
                                            src={photo.url as string}
                                            alt={photo.name as string}
                                            fit="cover"
                                            radius="xs"
                                        />
                                    </AspectRatio>
                                    <Text
                                        size="xs"
                                        mt={4}
                                        lineClamp={1}
                                        title={photo.name as string}
                                    >
                                        {photo.name as string}
                                    </Text>
                                </Card>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>

                {totalPages > 1 && (
                    <Center>
                        <Pagination
                            total={totalPages}
                            value={page}
                            onChange={setPage}
                            size="sm"
                        />
                    </Center>
                )}
            </Stack>
        </Modal>
    );
}
