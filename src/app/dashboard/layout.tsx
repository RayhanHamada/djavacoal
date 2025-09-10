import { PropsWithChildren } from "react";
import AdminLayout from "@/components/admin-layout";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return <AdminLayout>{children}</AdminLayout>;
}
