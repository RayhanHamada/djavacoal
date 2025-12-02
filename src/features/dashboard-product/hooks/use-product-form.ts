import type { ProductDetail } from "../lib/types";

import { useForm } from "@mantine/form";

import {
    ProductFormValues,
    validateProductFormSchema,
} from "../lib/form-schemas";

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
            metadata_description: product?.metadata_description ?? "",
            metadata_keywords: product?.metadata_keywords ?? [],
        },
        validate: validateProductFormSchema,
    });
}
