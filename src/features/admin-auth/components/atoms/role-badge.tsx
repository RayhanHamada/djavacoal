import { Badge } from "@mantine/core";
import { IconShield, IconUser } from "@tabler/icons-react";

type Props = {
    role: string | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
};

export function RoleBadge({ role, size = "sm" }: Props) {
    if (!role) {
        return null;
    }

    const isAdmin = role === "admin";
    const color = isAdmin ? "yellow" : "blue";
    const label = isAdmin ? "Superadmin" : "Admin";
    const Icon = isAdmin ? IconShield : IconUser;

    return (
        <Badge
            size={size}
            color={color}
            variant="light"
            leftSection={<Icon size={12} />}
        >
            {label}
        </Badge>
    );
}
