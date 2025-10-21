import { PropsWithChildren } from "react";

import { AdminLayout } from "@/components";

import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.css";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
    return <AdminLayout>{children}</AdminLayout>;
}
