"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useAppLocale } from "@/hooks";

export function LocaleChangeHandler() {
    const { locale } = useAppLocale();
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale]);

    return null;
}
