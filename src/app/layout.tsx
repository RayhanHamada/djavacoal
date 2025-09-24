import "./globals.css";

import { ClientGlobalProvider, ServerGlobalProvider } from "@/components";
import fonts from "@/configs/fonts";
import { metadatas } from "@/configs";

export const metadata = metadatas.root;

type Props = Readonly<{ children: React.ReactNode }>;

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={`${fonts.geistSans.variable} ${fonts.geistMono.variable} antialiased`}
      >
        <ServerGlobalProvider>
          <ClientGlobalProvider>{children}</ClientGlobalProvider>
        </ServerGlobalProvider>
      </body>
    </html>
  );
}
