import { redirectAuthenticatedUser } from "@/features/admin-auth/actions";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
  await redirectAuthenticatedUser();

  return children;
}
