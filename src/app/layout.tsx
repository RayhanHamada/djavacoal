import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientGlobalProvider, ServerGlobalProvider } from "@/components";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Djavacoal",
  description: "Quality Charcoal from Indonesia",
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServerGlobalProvider>
          <ClientGlobalProvider>{children}</ClientGlobalProvider>
        </ServerGlobalProvider>
      </body>
    </html>
  );
}
