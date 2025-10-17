import { PropsWithChildren } from "react";

import { redirectAuthenticatedUserActions } from "@/features/admin-auth/server/actions";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
    await redirectAuthenticatedUserActions();

    return children;
}
