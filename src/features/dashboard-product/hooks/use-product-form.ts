import type { MediaItem } from "../components/molecules/media-list-input";
import type { SpecificationItem } from "../components/molecules/specification-list-input";
import type { VariantItem } from "../components/molecules/variant-list-input";
import type { ProductDetail } from "../server/schemas";

import { useForm } from "@mantine/form";

export interface ProductFormValues {
    en_name: string;
    ar_name: string;
    en_description: string;
    ar_description: string;
    medias: MediaItem[];
    specifications: SpecificationItem[];
    variants: VariantItem[];
    moq: string;
    production_capacity: string;
    packaging_option_ids: string[];
    is_hidden: boolean;
}

export function useProductForm(product?: ProductDetail) {
    return useForm<ProductFormValues>({
        mode: "uncontrolled",
        initialValues: {
            en_name: product?.en_name ?? "",
            ar_name: product?.ar_name ?? "",
            en_description: product?.en_description ?? "",
            ar_description: product?.ar_description ?? "",
            medias:
                product?.medias.map((m) => ({
                    ...m,
                    id: String(m.id),
                })) ?? [],
            specifications:
                product?.specifications.map((s) => ({
                    ...s,
                    id: String(s.id),
                })) ?? [],
            variants:
                product?.variants.map((v) => ({
                    ...v,
                    id: String(v.id),
                })) ?? [],
            moq: product?.moq ?? "",
            production_capacity: product?.production_capacity ?? "",
            packaging_option_ids:
                product?.packaging_option_ids.map(String) ?? [],
            is_hidden: product?.is_hidden ?? false,
        },
        validate: {
            en_name: (value) =>
                !value?.trim() ? "English name is required" : null,
            ar_name: (value) =>
                !value?.trim() ? "Arabic name is required" : null,
            en_description: (value) => {
                if (!value?.trim()) return "English description is required";
                if (value.length > 1000)
                    return "English description must be 1000 characters or less";
                return null;
            },
            ar_description: (value) => {
                if (!value?.trim()) return "Arabic description is required";
                if (value.length > 1000)
                    return "Arabic description must be 1000 characters or less";
                return null;
            },
            moq: (value) => (!value?.trim() ? "MOQ is required" : null),
            production_capacity: (value) =>
                !value?.trim() ? "Production capacity is required" : null,
        },
    });
}
