import { VisitorLayout } from "@/components";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return <VisitorLayout>{children}</VisitorLayout>;
}
