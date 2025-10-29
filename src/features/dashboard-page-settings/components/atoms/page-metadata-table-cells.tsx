import { Badge, Group, Text } from "@mantine/core";

interface PathCellProps {
    path: string;
}

/**
 * Cell component to display the page path
 */
export function PathCell({ path }: PathCellProps) {
    return (
        <Text size="sm" fw={500} c="blue">
            {path}
        </Text>
    );
}

interface MetadataTitleCellProps {
    title: string;
}

/**
 * Cell component to display the metadata title
 */
export function MetadataTitleCell({ title }: MetadataTitleCellProps) {
    return (
        <Text size="sm" lineClamp={2}>
            {title}
        </Text>
    );
}

interface MetadataDescriptionCellProps {
    description: string;
}

/**
 * Cell component to display the metadata description
 */
export function MetadataDescriptionCell({
    description,
}: MetadataDescriptionCellProps) {
    return (
        <Text size="sm" c="dimmed" lineClamp={2}>
            {description}
        </Text>
    );
}

interface KeywordsCellProps {
    keywords: string[];
}

/**
 * Cell component to display keywords with badges
 * Shows first 4 keywords and a "+n more" badge if there are more
 */
export function KeywordsCell({ keywords }: KeywordsCellProps) {
    const displayKeywords = keywords.slice(0, 4);
    const remainingCount = keywords.length - 4;

    if (keywords.length === 0) {
        return (
            <Text size="sm" c="dimmed">
                No keywords
            </Text>
        );
    }

    return (
        <Group gap="xs">
            {displayKeywords.map((keyword, index) => (
                <Badge key={index} size="sm" variant="light">
                    {keyword}
                </Badge>
            ))}
            {remainingCount > 0 && (
                <Badge size="sm" variant="outline" c="dimmed">
                    +{remainingCount} more
                </Badge>
            )}
        </Group>
    );
}
