"use client";

import { queryClient } from "@/lib/tanstack-query-client";
import { QueryClientProvider } from "@tanstack/react-query";

import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function ClientGlobalProvider({ children }: Props) {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
