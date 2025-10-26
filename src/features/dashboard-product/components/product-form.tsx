"use client";

import type { ProductDetail } from "../server/schemas";

import {
    Button,
    Fieldset,
    MultiSelect,
    Stack,
    Switch,
    TextInput,
} from "@mantine/core";

import {
    usePackagingOptions,
    useProductForm,
    useProductMutations,
} from "../hooks";
import { BilingualDescriptionEditor } from "./molecules/bilingual-description-editor";
import { MediaListInput } from "./molecules/media-list-input";
import { SpecificationListInput } from "./molecules/specification-list-input";
import { VariantListInput } from "./molecules/variant-list-input";

interface ProductFormProps {
    product?: ProductDetail;
}

export function ProductForm({ product }: ProductFormProps) {
    const form = useProductForm(product);
    const { packagingOptions, isLoading: isLoadingPackaging } =
        usePackagingOptions();
    const { createMutation, updateMutation } = useProductMutations(product);

    const handleSubmit = form.onSubmit((values) => {
        if (product) {
            updateMutation.mutate(values);
        } else {
            createMutation.mutate(values);
        }
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="lg">
                {/* Product Names */}
                <Fieldset legend="Product Name">
                    <Stack gap="md">
                        <TextInput
                            label="English Name"
                            placeholder="Enter product name in English"
                            required
                            key={form.key("en_name")}
                            {...form.getInputProps("en_name")}
                            disabled={isSubmitting}
                        />
                        <TextInput
                            label="Arabic Name"
                            placeholder="أدخل اسم المنتج بالعربية"
                            required
                            key={form.key("ar_name")}
                            {...form.getInputProps("ar_name")}
                            disabled={isSubmitting}
                            dir="rtl"
                        />
                    </Stack>
                </Fieldset>

                {/* Product Description */}
                <Fieldset legend="Product Description">
                    <BilingualDescriptionEditor
                        enDescription={form.values.en_description}
                        arDescription={form.values.ar_description}
                        onEnChange={(value) =>
                            form.setFieldValue("en_description", value)
                        }
                        onArChange={(value) =>
                            form.setFieldValue("ar_description", value)
                        }
                        disabled={isSubmitting}
                        enError={form.errors.en_description as string}
                        arError={form.errors.ar_description as string}
                    />
                </Fieldset>

                {/* Media Section */}
                <Fieldset legend="Product Media">
                    <MediaListInput
                        value={form.values.medias}
                        onChange={(value) =>
                            form.setFieldValue("medias", value)
                        }
                        error={form.errors.medias as string}
                    />
                </Fieldset>

                {/* Specifications Section */}
                <Fieldset legend="Product Specifications">
                    <SpecificationListInput
                        value={form.values.specifications}
                        onChange={(value) =>
                            form.setFieldValue("specifications", value)
                        }
                        error={form.errors.specifications as string}
                    />
                </Fieldset>

                {/* Variants Section */}
                <Fieldset legend="Product Variants">
                    <VariantListInput
                        value={form.values.variants}
                        onChange={(value) =>
                            form.setFieldValue("variants", value)
                        }
                        error={form.errors.variants as string}
                    />
                </Fieldset>

                {/* Production Details Section */}
                <Fieldset legend="Production Details">
                    <Stack gap="md">
                        <TextInput
                            label="Minimum Order Quantity (MOQ)"
                            placeholder="e.g., 100 units"
                            required
                            key={form.key("moq")}
                            {...form.getInputProps("moq")}
                            disabled={isSubmitting}
                        />
                        <TextInput
                            label="Production Capacity"
                            placeholder="e.g., 1000 units per month"
                            required
                            key={form.key("production_capacity")}
                            {...form.getInputProps("production_capacity")}
                            disabled={isSubmitting}
                        />
                    </Stack>
                </Fieldset>

                {/* Packaging Options Section */}
                <MultiSelect
                    label="Packaging Options"
                    placeholder="Select packaging options"
                    data={packagingOptions}
                    key={form.key("packaging_option_ids")}
                    {...form.getInputProps("packaging_option_ids")}
                    disabled={isSubmitting || isLoadingPackaging}
                />

                {/* Visibility Toggle */}
                <Switch
                    label="Hide product from public view"
                    description="When enabled, this product will not be visible to visitors"
                    key={form.key("is_hidden")}
                    {...form.getInputProps("is_hidden", { type: "checkbox" })}
                    disabled={isSubmitting}
                />

                {/* Action Buttons */}
                <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {product ? "Update Product" : "Create Product"}
                </Button>
            </Stack>
        </form>
    );
}
