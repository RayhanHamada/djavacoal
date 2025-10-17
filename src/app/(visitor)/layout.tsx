import { PropsWithChildren } from "react";

import { VisitorLayout } from "@/components";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
    return <VisitorLayout>{children}</VisitorLayout>;
}
