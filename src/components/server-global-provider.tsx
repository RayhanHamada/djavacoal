import { PropsWithChildren } from "react";

import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";

type Props = PropsWithChildren;

export default function ServerGlobalProvider({ children }: Props) {
    return (
        <NextIntlClientProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
        </NextIntlClientProvider>
    );
}
