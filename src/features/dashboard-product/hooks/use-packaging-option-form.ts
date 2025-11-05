import { useEffect, useState } from "react";

import { useForm } from "@mantine/form";

import {
    validatePackagingOptionFormSchema,
    type PackagingOptionFormValues,
} from "../utils/form-schemas";

type UsePackagingOptionFormProps = {
    initialData?: PackagingOptionFormValues;
    assetUrl?: string;
};

export function usePackagingOptionForm({
    initialData,
    assetUrl = "",
}: UsePackagingOptionFormProps = {}) {
    const form = useForm<PackagingOptionFormValues>({
        mode: "uncontrolled",
        initialValues: {
            en_name: initialData?.en_name || "",
            ar_name: initialData?.ar_name || "",
            en_description: initialData?.en_description || "",
            ar_description: initialData?.ar_description || "",
            photo_key: initialData?.photo_key,
        },
        validate: validatePackagingOptionFormSchema,
    });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        initialData?.photo_key ? `${assetUrl}${initialData.photo_key}` : null
    );

    useEffect(() => {
        if (photoFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(photoFile);
        }
    }, [photoFile]);

    const handlePhotoChange = (file: File | null) => {
        if (file) {
            setPhotoFile(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        form.setFieldValue("photo_key", undefined);
    };

    const getSubmitData = (
        values: PackagingOptionFormValues
    ): PackagingOptionFormValues & { photo?: File } => {
        return {
            ...values,
            photo: photoFile || undefined,
        };
    };

    return {
        form,
        photoFile,
        photoPreview,
        handlePhotoChange,
        handleRemovePhoto,
        getSubmitData,
    };
}
