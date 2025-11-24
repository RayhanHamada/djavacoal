/**
 * Product Catalogue Constants
 */

// File constraints
export const PDF_MIME_TYPE = "application/pdf" as const;
export const MAX_CATALOGUE_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
export const MAX_CATALOGUE_FILE_SIZE_MB = 50;

// UI Text
export const CATALOGUE_FILE_NAME = "Product Catalogue.pdf";
export const CATALOGUE_EMPTY_TITLE = "No catalogue uploaded";
export const CATALOGUE_EMPTY_DESCRIPTION =
    "Upload a PDF file for your product catalogue";

// Notification IDs
export const NOTIFICATION_ID_UPLOAD = "uploading-catalogue";
export const NOTIFICATION_ID_DELETE = "deleting-catalogue";

// Notification Messages
export const NOTIFICATION_MESSAGES = {
    UPLOAD: {
        LOADING_TITLE: "Uploading Catalogue",
        LOADING_MESSAGE: "Please wait while we upload your file...",
        SUCCESS_TITLE: "Success",
        SUCCESS_MESSAGE: "Product catalogue uploaded successfully",
        ERROR_TITLE: "Error",
        ERROR_MESSAGE: "Failed to upload catalogue",
    },
    DELETE: {
        LOADING_TITLE: "Deleting Catalogue",
        LOADING_MESSAGE: "Please wait...",
        SUCCESS_TITLE: "Success",
        SUCCESS_MESSAGE: "Product catalogue deleted successfully",
        ERROR_TITLE: "Error",
        ERROR_MESSAGE: "Failed to delete catalogue",
    },
    VALIDATION: {
        INVALID_TYPE_TITLE: "Invalid File Type",
        INVALID_TYPE_MESSAGE: "Only PDF files are allowed",
        FILE_TOO_LARGE_TITLE: "File Too Large",
        FILE_TOO_LARGE_MESSAGE: `File size must not exceed ${MAX_CATALOGUE_FILE_SIZE_MB}MB`,
    },
} as const;

// File Requirements Text
export const FILE_REQUIREMENTS = [
    "PDF format only",
    `Maximum file size: ${MAX_CATALOGUE_FILE_SIZE_MB}MB`,
    "This catalogue will be available in the public API for all products",
] as const;

// Icon Sizes
export const ICON_SIZE = {
    SMALL: 18,
    MEDIUM: 40,
} as const;

// PDF Icon Styling
export const PDF_ICON_COLOR = "var(--mantine-color-red-6)";
export const PDF_ICON_STROKE = 1.5;
