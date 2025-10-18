"use client";

import {
    ActionIcon,
    AspectRatio,
    Box,
    Center,
    Image,
    Modal,
    Stack,
    Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";

interface PhotoPreviewModalProps {
    /** Whether the modal is open */
    opened: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Photo name to display as title */
    name: string;
    /** Photo URL to display */
    url: string;
}

/**
 * PhotoPreviewModal component displays a full-size photo with title
 * Dismissable by clicking close button or clicking outside
 */
export function PhotoPreviewModal({
    opened,
    onClose,
    name,
    url,
}: PhotoPreviewModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="auto"
            padding="md"
            withCloseButton={false}
            centered
        >
            <Stack gap="xs">
                {/* Close button and title row */}
                <Box pos="relative">
                    <ActionIcon
                        pos="absolute"
                        top={0}
                        left={0}
                        variant="filled"
                        color="dark"
                        onClick={onClose}
                        aria-label="Close preview"
                        style={{ zIndex: 10 }}
                    >
                        <IconX size={18} />
                    </ActionIcon>

                    <Text
                        size="md"
                        fw={500}
                        ta="center"
                        px={40}
                        style={{ lineHeight: "36px" }}
                    >
                        {name}
                    </Text>
                </Box>

                {/* Photo container with 4:3 aspect ratio */}
                {url && (
                    <AspectRatio ratio={4 / 3} maw={667} w="100%">
                        <Center
                            bg="gray.1"
                            style={{
                                borderRadius: "var(--mantine-radius-md)",
                                overflow: "hidden",
                            }}
                        >
                            <Image
                                src={url}
                                alt={name}
                                fit="contain"
                                mah={500}
                                maw={500}
                                style={{
                                    objectFit: "contain",
                                }}
                            />
                        </Center>
                    </AspectRatio>
                )}
            </Stack>
        </Modal>
    );
}
