import theme from "@/lib/mantine-theme";
import { MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function AdminLayout({ children }: Props) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
