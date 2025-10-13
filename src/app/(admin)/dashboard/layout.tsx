import { getAuthSession } from "@/features/admin-auth/actions/function";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
  const { data: session } = await getAuthSession();
  if (!session?.session) redirect("/auth/login");

  return children;
}
