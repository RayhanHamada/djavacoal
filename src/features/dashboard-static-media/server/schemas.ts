import "server-only";
import { z } from "zod/v4";

import {
    STATIC_MEDIA_KV_NAMESPACES,
    STATIC_MEDIA_PREFIXES,
} from "@/features/dashboard-static-media/server/constants";

const staticMediaKvNamespaceEnum = z.enum(STATIC_MEDIA_KV_NAMESPACES);

/**
 * Schema for generating presigned upload URL
 */
export const GenerateUploadUrlInputSchema = z.object({
    mimeType: z.string(),
    size: z.number(),
    prefix: z.enum(STATIC_MEDIA_PREFIXES),
});

export const GenerateUploadUrlOutputSchema = z.object({
    uploadUrl: z.string(),
    key: z.string(),
});

/**
 * Schema for saving photo list to KV
 */
export const SavePhotoListInputSchema = z.object({
    kvKey: staticMediaKvNamespaceEnum,
    photoKeys: z.array(z.string()),
});

/**
 * Schema for getting photo list from KV
 */
export const GetPhotoListInputSchema = z.object({
    kvKey: staticMediaKvNamespaceEnum,
});

export const GetPhotoListOutputSchema = z.object({
    photos: z.array(
        z.object({
            key: z.string(),
            url: z.string(),
        })
    ),
});

/**
 * Schema for saving YouTube video URL
 */
export const SaveYouTubeUrlInputSchema = z.object({
    kvKey: z.enum(["who_we_are_video"]),
    url: z.url(),
});

/**
 * Schema for getting YouTube video URL
 */
export const GetYouTubeUrlInputSchema = z.object({
    kvKey: z.enum(["who_we_are_video"]),
});

export const GetYouTubeUrlOutputSchema = z.object({
    url: z.string().nullable(),
    videoId: z.string().nullable(),
});

/**
 * Schema for saving reels (YouTube Shorts)
 */
export const SaveReelsInputSchema = z.object({
    reels: z.array(
        z.object({
            url: z.url(),
            videoId: z.string(),
        })
    ),
});

/**
 * Schema for getting reels
 */
export const GetReelsOutputSchema = z.object({
    reels: z.array(
        z.object({
            url: z.string(),
            videoId: z.string(),
        })
    ),
});

/**
 * Schema for deleting a photo from R2
 */
export const DeletePhotoInputSchema = z.object({
    key: z.string(),
});
