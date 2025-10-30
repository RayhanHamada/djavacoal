"use client";

import { useCallback, useState } from "react";

/**
 * Hook for managing file upload with preview
 */
export function useFileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileSelect = useCallback((selectedFile: File | null) => {
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    }, []);

    const clearFile = useCallback(() => {
        setFile(null);
        setPreview(null);
    }, []);

    return {
        file,
        preview,
        handleFileSelect,
        clearFile,
    };
}
