import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PropsWithChildren } from "react";
import { NextIntlClientProvider } from "next-intl";

type Props = PropsWithChildren;

function ServerGlobalProvider({ children }: Props) {
  return (
    <NextIntlClientProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </NextIntlClientProvider>
  );
}

export default ServerGlobalProvider;
