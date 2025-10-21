import "server-only";

import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { DEFAULT_BUCKET_NAME, PRESIGNED_URL_EXPIRATION } from "./constants";

/**
 * R2 Client Configuration
 */
interface R2Config {
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
}

/**
 * Options for generating presigned URLs
 */
interface PresignedUrlOptions {
    key: string;
    contentType: string;
    bucketName?: string;
    expiresIn?: number;
}

/**
 * Create and return an S3 client configured for Cloudflare R2
 *
 * @param config - R2 configuration with endpoint and credentials
 * @returns Configured S3Client instance
 */
export function getR2Client(config: R2Config): S3Client {
    return new S3Client({
        region: "auto",
        endpoint: config.endpoint,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
        },
    });
}

/**
 * Generate a presigned URL for uploading a file to R2
 *
 * @param client - S3Client instance
 * @param options - Upload options including key, content type, and optional bucket name
 * @returns Presigned URL string valid for the specified duration
 */
export async function generatePresignedUploadUrl(
    client: S3Client,
    options: PresignedUrlOptions
): Promise<string> {
    const {
        key,
        contentType,
        bucketName = DEFAULT_BUCKET_NAME,
        expiresIn = PRESIGNED_URL_EXPIRATION,
    } = options;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
    });

    return await getSignedUrl(client, command, { expiresIn });
}

/**
 * Upload text content directly to R2
 *
 * @param client - S3Client instance
 * @param key - Object key in R2
 * @param content - Text content to upload
 * @param bucketName - Optional bucket name (defaults to DEFAULT_BUCKET_NAME)
 */
export async function uploadTextContent(
    client: S3Client,
    key: string,
    content: string,
    bucketName: string = DEFAULT_BUCKET_NAME
): Promise<void> {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: content,
        ContentType: "text/html; charset=utf-8",
    });

    await client.send(command);
}

/**
 * Get text content from R2
 *
 * @param client - S3Client instance
 * @param key - Object key in R2
 * @param bucketName - Optional bucket name (defaults to DEFAULT_BUCKET_NAME)
 * @returns Text content as string
 */
export async function getTextContent(
    client: S3Client,
    key: string,
    bucketName: string = DEFAULT_BUCKET_NAME
): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    const response = await client.send(command);
    return (await response.Body?.transformToString()) ?? "";
}

/**
 * Delete an object from R2
 *
 * @param client - S3Client instance
 * @param key - Object key in R2
 * @param bucketName - Optional bucket name (defaults to DEFAULT_BUCKET_NAME)
 */
export async function deleteObject(
    client: S3Client,
    key: string,
    bucketName: string = DEFAULT_BUCKET_NAME
): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    await client.send(command);
}
