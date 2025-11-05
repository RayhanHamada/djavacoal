import { useEffect, useState } from "react";

import { useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeIcon() {
    const { colorScheme } = useMantineColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <IconSun size={20} />;

    return colorScheme === "dark" ? (
        <IconSun size={20} />
    ) : (
        <IconMoon size={20} />
    );
}
