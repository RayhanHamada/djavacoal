"use client";

import { useCallback, useState } from "react";

/**
 * Manages drag-and-drop functionality for file uploads
 */
export function useDragAndDrop(onFilesDropped: (files: File[]) => void) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);

            const droppedFiles = Array.from(e.dataTransfer.files).filter(
                (file) => file.type.startsWith("image/")
            );

            if (droppedFiles.length > 0) {
                onFilesDropped(droppedFiles);
            }
        },
        [onFilesDropped]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    return {
        isDragOver,
        handleDrop,
        handleDragOver,
        handleDragLeave,
    };
}
