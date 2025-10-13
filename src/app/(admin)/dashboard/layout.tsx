import { guardAuthenticatedRoute } from "@/features/admin-auth/actions/function";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
  await guardAuthenticatedRoute();

  return children;
}
