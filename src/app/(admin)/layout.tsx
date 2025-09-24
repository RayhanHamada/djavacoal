import { PropsWithChildren } from "react";
import { AdminLayout } from "@/components";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return <AdminLayout>{children}</AdminLayout>;
}
