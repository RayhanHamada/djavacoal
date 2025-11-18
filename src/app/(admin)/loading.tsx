import Image from "next/image";

import { Center, Loader, Stack } from "@mantine/core";

export default function Loading() {
    return (
        <Center
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "gray",
                zIndex: 9999,
            }}
        >
            <Stack align="center" gap="xl">
                <Image
                    src="/images/logo.png"
                    alt="Djavacoal"
                    width={200}
                    height={60}
                    priority
                />
                <Loader color="dark" size="md" type="dots" />
            </Stack>
        </Center>
    );
}
