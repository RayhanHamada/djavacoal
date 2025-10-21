"use client";

import { PropsWithChildren } from "react";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/tanstack-query-client";

type Props = PropsWithChildren;

export default function ClientGlobalProvider({ children }: Props) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <TanStackDevtools
                    config={{ position: "bottom-right" }}
                    plugins={[
                        {
                            name: "TanStack Query",
                            render: <ReactQueryDevtoolsPanel />,
                        },
                    ]}
                />
                {children}
            </QueryClientProvider>
        </>
    );
}
