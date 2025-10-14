import { redirectAuthenticatedUserActions } from "@/features/admin-auth/server/actions";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
  await redirectAuthenticatedUserActions();

  return children;
}
