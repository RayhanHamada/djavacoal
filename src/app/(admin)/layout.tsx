import { PropsWithChildren } from "react";

import { AdminLayout } from "@/components";

import "@mantine/core/styles.layer.css";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
    return <AdminLayout>{children}</AdminLayout>;
}
