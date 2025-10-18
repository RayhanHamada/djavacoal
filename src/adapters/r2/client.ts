import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
