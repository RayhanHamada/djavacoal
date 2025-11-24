import { notifications } from "@mantine/notifications";

import {
    MAX_CATALOGUE_FILE_SIZE,
    NOTIFICATION_ID_DELETE,
    NOTIFICATION_ID_UPLOAD,
    NOTIFICATION_MESSAGES,
    PDF_MIME_TYPE,
} from "@/features/dashboard-static-media/lib/constants";

/**
 * Validate PDF file type and size
 */
export function validatePdfFile(file: File): {
    isValid: boolean;
    error?: { title: string; message: string };
} {
    if (file.type !== PDF_MIME_TYPE) {
        return {
            isValid: false,
            error: {
                title: NOTIFICATION_MESSAGES.VALIDATION.INVALID_TYPE_TITLE,
                message: NOTIFICATION_MESSAGES.VALIDATION.INVALID_TYPE_MESSAGE,
            },
        };
    }

    if (file.size > MAX_CATALOGUE_FILE_SIZE) {
        return {
            isValid: false,
            error: {
                title: NOTIFICATION_MESSAGES.VALIDATION.FILE_TOO_LARGE_TITLE,
                message:
                    NOTIFICATION_MESSAGES.VALIDATION.FILE_TOO_LARGE_MESSAGE,
            },
        };
    }

    return { isValid: true };
}

/**
 * Show upload loading notification
 */
export function showUploadLoadingNotification() {
    notifications.show({
        id: NOTIFICATION_ID_UPLOAD,
        loading: true,
        title: NOTIFICATION_MESSAGES.UPLOAD.LOADING_TITLE,
        message: NOTIFICATION_MESSAGES.UPLOAD.LOADING_MESSAGE,
        autoClose: false,
        withCloseButton: false,
    });
}

/**
 * Show upload success notification
 */
export function showUploadSuccessNotification() {
    notifications.update({
        id: NOTIFICATION_ID_UPLOAD,
        loading: false,
        title: NOTIFICATION_MESSAGES.UPLOAD.SUCCESS_TITLE,
        message: NOTIFICATION_MESSAGES.UPLOAD.SUCCESS_MESSAGE,
        color: "green",
        autoClose: 3000,
    });
}

/**
 * Show upload error notification
 */
export function showUploadErrorNotification(error?: Error) {
    notifications.update({
        id: NOTIFICATION_ID_UPLOAD,
        loading: false,
        title: NOTIFICATION_MESSAGES.UPLOAD.ERROR_TITLE,
        message: error?.message || NOTIFICATION_MESSAGES.UPLOAD.ERROR_MESSAGE,
        color: "red",
        autoClose: 5000,
    });
}

/**
 * Show delete loading notification
 */
export function showDeleteLoadingNotification() {
    notifications.show({
        id: NOTIFICATION_ID_DELETE,
        loading: true,
        title: NOTIFICATION_MESSAGES.DELETE.LOADING_TITLE,
        message: NOTIFICATION_MESSAGES.DELETE.LOADING_MESSAGE,
        autoClose: false,
        withCloseButton: false,
    });
}

/**
 * Show delete success notification
 */
export function showDeleteSuccessNotification() {
    notifications.update({
        id: NOTIFICATION_ID_DELETE,
        loading: false,
        title: NOTIFICATION_MESSAGES.DELETE.SUCCESS_TITLE,
        message: NOTIFICATION_MESSAGES.DELETE.SUCCESS_MESSAGE,
        color: "green",
        autoClose: 2000,
    });
}

/**
 * Show delete error notification
 */
export function showDeleteErrorNotification() {
    notifications.update({
        id: NOTIFICATION_ID_DELETE,
        loading: false,
        title: NOTIFICATION_MESSAGES.DELETE.ERROR_TITLE,
        message: NOTIFICATION_MESSAGES.DELETE.ERROR_MESSAGE,
        color: "red",
        autoClose: 3000,
    });
}
