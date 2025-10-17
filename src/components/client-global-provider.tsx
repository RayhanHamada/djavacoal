"use client";

import { PropsWithChildren } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/tanstack-query-client";

type Props = PropsWithChildren;

export default function ClientGlobalProvider({ children }: Props) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools position="left" />
                {children}
            </QueryClientProvider>
        </>
    );
}
