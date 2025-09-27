import "./globals.css";

import { ClientGlobalProvider, ServerGlobalProvider } from "@/components";
import fonts from "@/configs/fonts";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

type Props = Readonly<PropsWithChildren>;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Djavacoal",
    description: "Quality Charcoal from Indonesia",
  };
}

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
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
