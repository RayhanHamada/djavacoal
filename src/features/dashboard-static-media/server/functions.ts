import "server-only";

import { KV_KEYS } from "@/adapters/kv/constants";
import {
    DEFAULT_BUCKET_NAME,
    deleteObject,
    generatePresignedUploadUrl,
    getR2Client,
} from "@/adapters/r2";
import {
    buildPhotoUrl,
    extractYouTubeId,
    generateR2Key,
    getR2Prefix,
} from "@/features/dashboard-static-media/server/helpers";
import {
    DeletePhotoInputSchema,
    GenerateUploadUrlInputSchema,
    GenerateUploadUrlOutputSchema,
    GetContactSettingsOutputSchema,
    GetPhotoListInputSchema,
    GetPhotoListOutputSchema,
    GetReelsOutputSchema,
    GetYouTubeUrlInputSchema,
    GetYouTubeUrlOutputSchema,
    SaveContactSettingsInputSchema,
    SavePhotoListInputSchema,
    SaveReelsInputSchema,
    SaveYouTubeUrlInputSchema,
} from "@/features/dashboard-static-media/server/schemas";
import base from "@/lib/orpc/server";

/**
 * Generate presigned URL for uploading a photo
 */
export const generateUploadUrl = base
    .input(GenerateUploadUrlInputSchema)
    .output(GenerateUploadUrlOutputSchema)
    .handler(async function ({ input }) {
        const { mimeType, prefix } = input;

        // Generate R2 key
        const r2Prefix = getR2Prefix(prefix);
        const key = generateR2Key(r2Prefix);

        // Create R2 client
        const r2Client = getR2Client({
            endpoint: process.env.S3_API,
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        });

        // Generate presigned URL
        const uploadUrl = await generatePresignedUploadUrl(r2Client, {
            key,
            contentType: mimeType,
            bucketName: DEFAULT_BUCKET_NAME,
        });

        return {
            uploadUrl,
            key,
        };
    })
    .callable();

/**
 * Save photo list to KV
 */
export const savePhotoList = base
    .input(SavePhotoListInputSchema)
    .handler(async function ({ context: { env }, input }) {
        const { kvKey, photoKeys } = input;

        await env.DJAVACOAL_KV.put(kvKey, JSON.stringify(photoKeys));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Get photo list from KV
 */
export const getPhotoList = base
    .input(GetPhotoListInputSchema)
    .output(GetPhotoListOutputSchema)
    .handler(async function ({ context: { env }, input }) {
        const { kvKey } = input;

        const data = await env.DJAVACOAL_KV.get(kvKey);
        const photoKeys: string[] = data ? JSON.parse(data) : [];

        const photos = photoKeys.map((key) => ({
            key,
            url: buildPhotoUrl(key, process.env.NEXT_PUBLIC_ASSET_URL),
        }));

        return {
            photos,
        };
    })
    .callable();

/**
 * Save YouTube video URL to KV
 */
export const saveYouTubeUrl = base
    .input(SaveYouTubeUrlInputSchema)
    .handler(async function ({ context: { env }, input }) {
        const { kvKey, url } = input;

        await env.DJAVACOAL_KV.put(kvKey, url);

        return {
            success: true,
        };
    })
    .callable();

/**
 * Get YouTube video URL from KV
 */
export const getYouTubeUrl = base
    .input(GetYouTubeUrlInputSchema)
    .output(GetYouTubeUrlOutputSchema)
    .handler(async function ({ context: { env }, input }) {
        const { kvKey } = input;

        const url = await env.DJAVACOAL_KV.get(kvKey);
        const videoId = url ? extractYouTubeId(url) : null;

        return {
            url: url || null,
            videoId,
        };
    })
    .callable();

/**
 * Save reels (YouTube Shorts) to KV
 */
export const saveReels = base
    .input(SaveReelsInputSchema)
    .handler(async function ({ context: { env }, input }) {
        const { reels } = input;

        await env.DJAVACOAL_KV.put("reels", JSON.stringify(reels));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Get reels from KV
 */
export const getReels = base
    .output(GetReelsOutputSchema)
    .handler(async function ({ context: { env } }) {
        const data = await env.DJAVACOAL_KV.get("reels");
        const reels: Array<{ url: string; videoId: string }> = data
            ? JSON.parse(data)
            : [];

        return {
            reels,
        };
    })
    .callable();

/**
 * Delete a photo from R2
 */
export const deletePhoto = base
    .input(DeletePhotoInputSchema)
    .handler(async function ({ input }) {
        const { key } = input;

        // Create R2 client
        const r2Client = getR2Client({
            endpoint: process.env.S3_API,
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        });

        // Delete from R2
        await deleteObject(r2Client, key, DEFAULT_BUCKET_NAME);

        return {
            success: true,
        };
    })
    .callable();

/**
 * Save contact settings to KV
 */
export const saveContactSettings = base
    .input(SaveContactSettingsInputSchema)
    .handler(async function ({ context: { env }, input }) {
        // Save each field to its respective KV key
        const kvOperations = [];

        if (input.facebookLink !== undefined) {
            kvOperations.push(
                env.DJAVACOAL_KV.put(KV_KEYS.FACEBOOK_LINK, input.facebookLink)
            );
        }
        if (input.linkedinLink !== undefined) {
            kvOperations.push(
                env.DJAVACOAL_KV.put(KV_KEYS.LINKEDIN_LINK, input.linkedinLink)
            );
        }
        if (input.instagramLink !== undefined) {
            kvOperations.push(
                env.DJAVACOAL_KV.put(
                    KV_KEYS.INSTAGRAM_LINK,
                    input.instagramLink
                )
            );
        }
        if (input.tiktokLink !== undefined) {
            kvOperations.push(
                env.DJAVACOAL_KV.put(KV_KEYS.TIKTOK_LINK, input.tiktokLink)
            );
        }
        if (input.emailAddress !== undefined) {
            kvOperations.push(
                env.DJAVACOAL_KV.put(KV_KEYS.EMAIL_ADDRESS, input.emailAddress)
            );
        }
        if (input.whatsappNumber !== undefined) {
            kvOperations.push(
                env.DJAVACOAL_KV.put(
                    KV_KEYS.WHATSAPP_NUMBER,
                    input.whatsappNumber
                )
            );
        }
        if (input.mapsLink !== undefined) {
            kvOperations.push(
                env.DJAVACOAL_KV.put(KV_KEYS.MAPS_LINK, input.mapsLink)
            );
        }
        if (input.addressLine !== undefined) {
            kvOperations.push(
                env.DJAVACOAL_KV.put(KV_KEYS.ADDRESS_LINE, input.addressLine)
            );
        }

        await Promise.all(kvOperations);

        return {
            success: true,
        };
    })
    .callable();

/**
 * Get contact settings from KV
 */
export const getContactSettings = base
    .output(GetContactSettingsOutputSchema)
    .handler(async function ({ context: { env } }) {
        // Fetch all contact settings in parallel
        const [
            facebookLink,
            linkedinLink,
            instagramLink,
            tiktokLink,
            emailAddress,
            whatsappNumber,
            mapsLink,
            addressLine,
        ] = await Promise.all([
            env.DJAVACOAL_KV.get(KV_KEYS.FACEBOOK_LINK),
            env.DJAVACOAL_KV.get(KV_KEYS.LINKEDIN_LINK),
            env.DJAVACOAL_KV.get(KV_KEYS.INSTAGRAM_LINK),
            env.DJAVACOAL_KV.get(KV_KEYS.TIKTOK_LINK),
            env.DJAVACOAL_KV.get(KV_KEYS.EMAIL_ADDRESS),
            env.DJAVACOAL_KV.get(KV_KEYS.WHATSAPP_NUMBER),
            env.DJAVACOAL_KV.get(KV_KEYS.MAPS_LINK),
            env.DJAVACOAL_KV.get(KV_KEYS.ADDRESS_LINE),
        ]);

        return {
            facebookLink: facebookLink || null,
            linkedinLink: linkedinLink || null,
            instagramLink: instagramLink || null,
            tiktokLink: tiktokLink || null,
            emailAddress: emailAddress || null,
            whatsappNumber: whatsappNumber || null,
            mapsLink: mapsLink || null,
            addressLine: addressLine || null,
        };
    })
    .callable();
