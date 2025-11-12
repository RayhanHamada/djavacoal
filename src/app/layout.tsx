import "./globals.css";

import { PropsWithChildren } from "react";

import { mantineHtmlProps } from "@mantine/core";

import { ClientGlobalProvider, ServerGlobalProvider } from "@/components";
import fonts from "@/configs/fonts";

type Props = Readonly<PropsWithChildren>;

export default async function Layout({ children }: Props) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <body
                className={`${fonts.josefinSans.variable} ${fonts.openSans.variable} antialiased`}
            >
                <ServerGlobalProvider>
                    <ClientGlobalProvider>{children}</ClientGlobalProvider>
                </ServerGlobalProvider>
            </body>
        </html>
    );
}
