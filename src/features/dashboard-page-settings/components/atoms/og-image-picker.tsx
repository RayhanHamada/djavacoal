"use client";

import { useState } from "react";

import {
    ActionIcon,
    AspectRatio,
    Box,
    Button,
    Card,
    Center,
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
import { IconPhoto, IconSearch, IconTrash, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "ahooks";

import { rpc } from "@/lib/rpc";

interface OgImagePickerProps {
    /** Current OG image key (from R2) */
    value: string | null | undefined;
    /** Callback when image is selected or removed */
    onChange: (key: string | null) => void;
    /** Whether the picker is disabled */
    disabled?: boolean;
}

/**
 * Builds a URL for displaying the OG image from R2
 */
function getOgImageUrl(key: string): string {
    return `${process.env.NEXT_PUBLIC_ASSET_URL}${key}`;
}

/**
 * OgImagePicker - Atom component for selecting OpenGraph images from gallery
 *
 * Displays current image preview with options to change or remove.
 * Opens a gallery picker modal for selecting images.
 */
export function OgImagePicker({
    value,
    onChange,
    disabled = false,
}: OgImagePickerProps) {
    const [modalOpened, setModalOpened] = useState(false);

    const handleSelect = (photo: { key: string }) => {
        onChange(photo.key);
        setModalOpened(false);
    };

    const handleRemove = () => {
        onChange(null);
    };

    const imageUrl = value ? getOgImageUrl(value) : null;

    return (
        <Stack gap="xs">
            <Text size="sm" fw={500}>
                OpenGraph Image
            </Text>
            <Text size="xs" c="dimmed">
                Image displayed when sharing on social media (recommended:
                1200×630px)
            </Text>

            {imageUrl ? (
                <Card withBorder p="xs" radius="md">
                    <Stack gap="xs">
                        <AspectRatio ratio={1200 / 630}>
                            <Image
                                src={imageUrl}
                                alt="OpenGraph preview"
                                fit="cover"
                                radius="sm"
                            />
                        </AspectRatio>
                        <Group gap="xs">
                            <Button
                                variant="light"
                                size="xs"
                                leftSection={<IconPhoto size={14} />}
                                onClick={() => setModalOpened(true)}
                                disabled={disabled}
                                flex={1}
                            >
                                Change
                            </Button>
                            <Button
                                variant="light"
                                color="red"
                                size="xs"
                                leftSection={<IconTrash size={14} />}
                                onClick={handleRemove}
                                disabled={disabled}
                            >
                                Remove
                            </Button>
                        </Group>
                    </Stack>
                </Card>
            ) : (
                <Button
                    variant="light"
                    leftSection={<IconPhoto size={16} />}
                    onClick={() => setModalOpened(true)}
                    disabled={disabled}
                >
                    Choose from Gallery
                </Button>
            )}

            <OgImagePickerModal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onSelect={handleSelect}
            />
        </Stack>
    );
}

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
