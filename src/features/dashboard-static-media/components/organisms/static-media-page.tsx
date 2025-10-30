"use client";

import { Container, Paper, Stack, Title } from "@mantine/core";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import {
    PhotoGalleryManager,
    ReelsManager,
    SinglePhotoUploader,
    YouTubeVideoInput,
} from "@/features/dashboard-static-media/components/molecules";

/**
 * StaticMediaPage - Main organism component for managing all static media
 */
export function StaticMediaPage() {
    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <div>
                    <Title order={1} size="h2">
                        Static Media Management
                    </Title>
                </div>

                <PhotoProvider>
                    {/* Home Carousel Photos */}
                    <Paper p="xl" withBorder radius="md" shadow="sm">
                        <PhotoGalleryManager
                            kvKey="home_carousel_photo"
                            title="Home Carousel Photos"
                            description="Upload wide banner photos for the home page carousel. Photos will be displayed in the order you arrange them."
                            aspectRatio="wide"
                            minDimensions={{ width: 1920, height: 1080 }}
                            prefix="carousel"
                        />
                    </Paper>

                    {/* Visit Our Factory Photo */}
                    <Paper p="xl" withBorder radius="md" shadow="sm">
                        <SinglePhotoUploader
                            kvKey="visit_our_factory_photo"
                            title="Visit Our Factory Photo"
                            description="Upload a single photo for the 'Visit Our Factory' section."
                            aspectRatio="wide"
                            prefix="factory-visit"
                        />
                    </Paper>

                    {/* Who We Are Video */}
                    <Paper p="xl" withBorder radius="md" shadow="sm">
                        <YouTubeVideoInput
                            title="Who We Are Video"
                            description="Add a YouTube video URL for the 'Who We Are' section."
                        />
                    </Paper>

                    {/* Factory Photo */}
                    <Paper p="xl" withBorder radius="md" shadow="sm">
                        <SinglePhotoUploader
                            kvKey="factory_photo"
                            title="Factory Photo"
                            description="Upload a single photo of the factory."
                            aspectRatio="square"
                            prefix="factory-photo"
                        />
                    </Paper>

                    {/* Reels (YouTube Shorts) */}
                    <Paper p="xl" withBorder radius="md" shadow="sm">
                        <ReelsManager
                            title="Reels (YouTube Shorts)"
                            description="Add YouTube Shorts videos. They will be displayed in the order you arrange them."
                        />
                    </Paper>

                    {/* Factory Gallery Photos */}
                    <Paper p="xl" withBorder radius="md" shadow="sm">
                        <PhotoGalleryManager
                            kvKey="factory_gallery_photos"
                            title="Factory Gallery Photos"
                            description="Upload photos for the factory gallery. Square aspect ratio recommended."
                            aspectRatio="square"
                            prefix="factory-gallery"
                        />
                    </Paper>

                    {/* Product Gallery Photos */}
                    <Paper p="xl" withBorder radius="md" shadow="sm">
                        <PhotoGalleryManager
                            kvKey="product_gallery_photos"
                            title="Product Gallery Photos"
                            description="Upload photos for the product gallery. Square aspect ratio recommended."
                            aspectRatio="square"
                            prefix="product-gallery"
                        />
                    </Paper>
                </PhotoProvider>
            </Stack>
        </Container>
    );
}
