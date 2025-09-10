import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

function ServerGlobalProvider({ children }: Props) {
  return (
    <>
      <NuqsAdapter>{children}</NuqsAdapter>
    </>
  );
}

export default ServerGlobalProvider;
