"use client";

import { useState } from "react";

import {
    ActionIcon,
    AspectRatio,
    Box,
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
import { IconPhoto, IconSearch, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "ahooks";

import { rpc } from "@/lib/rpc";

interface GalleryPickerModalProps {
    opened: boolean;
    onClose: () => void;
    onSelect: (photo: {
        id: string;
        name: string;
        key: string;
        url: string;
    }) => void;
}

/**
 * Modal for selecting a photo from the gallery
 * Displays photos in a 5-column grid with search and pagination
 */
export function GalleryPickerModal({
    opened,
    onClose,
    onSelect,
}: GalleryPickerModalProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, { wait: 500 });

    // Fetch photos
    const photosQuery = useQuery(
        rpc.gallery.listPhotos.queryOptions({
            enabled: opened,
            input: {
                search: debouncedSearch,
                page,
                limit: 16,
                sortBy: "updated_at",
                sortOrder: "desc",
            },
        })
    );

    const photos = photosQuery.data?.photos ?? [];
    const totalPages = photosQuery.data?.totalPages ?? 1;

    const handlePhotoClick = (photo: Record<string, any>) => {
        onSelect({
            id: photo.id,
            name: photo.name,
            key: photo.key,
            url: photo.url,
        });
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="xl"
            title={
                <Group gap="xs">
                    <IconPhoto size={24} />
                    <Text size="lg" fw={600}>
                        Choose from Gallery
                    </Text>
                </Group>
            }
            padding="lg"
        >
            <Stack gap="md">
                {/* Search */}
                <TextInput
                    placeholder="Search photos by name..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.currentTarget.value);
                        setPage(1); // Reset to first page on search
                    }}
                    leftSection={<IconSearch size={16} />}
                    rightSection={
                        search && (
                            <ActionIcon
                                variant="transparent"
                                onClick={() => setSearch("")}
                            >
                                <IconX size={16} />
                            </ActionIcon>
                        )
                    }
                />

                {/* Photo Grid */}
                <Box mih={400}>
                    {photosQuery.isLoading ? (
                        <Center h={400}>
                            <Loader size="lg" />
                        </Center>
                    ) : photosQuery.isError ? (
                        <Center h={400}>
                            <Stack align="center">
                                <Text c="red">Error loading photos</Text>
                            </Stack>
                        </Center>
                    ) : photos.length === 0 ? (
                        <Center h={400}>
                            <Text c="dimmed">
                                {search
                                    ? "No photos found matching your search"
                                    : "No photos available. Upload photos in the Gallery page first."}
                            </Text>
                        </Center>
                    ) : (
                        <SimpleGrid cols={4} spacing="md">
                            {photos.map((photo: Record<string, any>) => (
                                <Card
                                    key={photo.id}
                                    shadow="sm"
                                    padding="xs"
                                    radius="md"
                                    withBorder
                                    style={{
                                        cursor: "pointer",
                                        transition: "transform 0.2s",
                                    }}
                                    onClick={() => handlePhotoClick(photo)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1)";
                                    }}
                                >
                                    {/* Photo thumbnail with 4:3 aspect ratio */}
                                    <AspectRatio ratio={4 / 3}>
                                        <Box
                                            style={{
                                                borderRadius:
                                                    "var(--mantine-radius-md)",
                                                backgroundColor:
                                                    "var(--mantine-color-gray-1)",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Image
                                                src={photo.url}
                                                alt={photo.name}
                                                fit="cover"
                                                h="100%"
                                                w="100%"
                                            />
                                        </Box>
                                    </AspectRatio>

                                    {/* Photo name */}
                                    <Text
                                        size="xs"
                                        mt="xs"
                                        lineClamp={1}
                                        title={photo.name}
                                    >
                                        {photo.name}
                                    </Text>
                                </Card>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Center>
                        <Pagination
                            total={totalPages}
                            value={page}
                            onChange={setPage}
                        />
                    </Center>
                )}
            </Stack>
        </Modal>
    );
}
