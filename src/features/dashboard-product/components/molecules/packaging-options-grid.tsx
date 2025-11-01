"use client";

import { SimpleGrid, Text } from "@mantine/core";

import { PackagingOptionCard } from "../atoms";

type PackagingOption = {
    id: number;
    en_name: string;
    ar_name: string;
    en_description: string;
    ar_description: string;
    photo_key: string;
};

type PackagingOptionsGridProps = {
    options: PackagingOption[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    assetUrl: string;
};

export function PackagingOptionsGrid({
    options,
    onEdit,
    onDelete,
    assetUrl,
}: PackagingOptionsGridProps) {
    if (options.length === 0) {
        return (
            <Text c="dimmed" ta="center" mt="xl">
                No packaging options found
            </Text>
        );
    }

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
            {options.map((option) => (
                <PackagingOptionCard
                    key={option.id}
                    id={option.id}
                    enName={option.en_name}
                    arName={option.ar_name}
                    enDescription={option.en_description}
                    arDescription={option.ar_description}
                    photoUrl={`${assetUrl}${option.photo_key}`}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </SimpleGrid>
    );
}
