import { VisitorFooter, VisitorNavbar } from "@/components/molecules";
import { Fragment, PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function VisitorLayout({ children }: Props) {
  return (
    <Fragment>
      <VisitorNavbar />
      <div className="h-22" />
      <main className="min-h-screen">{children}</main>
      <VisitorFooter />
    </Fragment>
  );
}
