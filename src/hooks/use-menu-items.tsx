"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { $api } from "@/adapters/public-api/client";

export type MenuItem = {
    label: string;
    href?: string;
    submenus?: {
        label: string;
        href: string;
    }[];
};

export function useMenuItems() {
    const t = useTranslations("Navigation");
    const { data: namesData } = $api.useQuery("get", "/products-names");

    const productSubmenus = useMemo(
        () =>
            namesData?.data?.names.map(({ name }) => ({
                label: name,
                href: `/our-products#${encodeURIComponent(name)}`,
            })) ?? [],
        [namesData]
    );

    const menuItems = useMemo<MenuItem[]>(
        () => [
            {
                label: t("home"),
                href: "/",
            },
            {
                label: t("aboutCompany"),
                submenus: [
                    {
                        label: t("aboutCompanySubmenus.cvDjavacoal"),
                        href: "/about-company#cv-djavacoal-indonesia",
                    },
                    {
                        label: t("aboutCompanySubmenus.team"),
                        href: "/about-company#djavacoals-team",
                    },
                    {
                        label: t("aboutCompanySubmenus.whatWeDo"),
                        href: "/about-company#what-we-do",
                    },
                    {
                        label: t("aboutCompanySubmenus.legalCertificate"),
                        href: "/about-company#legal-certificate",
                    },
                    {
                        label: t("aboutCompanySubmenus.factory"),
                        href: "/about-company#factory",
                    },
                    {
                        label: t("aboutCompanySubmenus.gallery"),
                        href: "/about-company#our-gallery",
                    },
                ],
            },
            {
                label: t("ourProducts"),
                submenus: productSubmenus,
            },
            {
                label: t("productionInfo"),
                submenus: [
                    {
                        label: t("productionInfoSubmenus.process"),
                        href: "/production-info#production-process",
                    },
                    {
                        label: t("productionInfoSubmenus.moqPayment"),
                        href: "/production-info#moq-payment",
                    },
                    {
                        label: t("productionInfoSubmenus.shipment"),
                        href: "/production-info#shipment-terms",
                    },
                    {
                        label: t("productionInfoSubmenus.packagingOption"),
                        href: "/production-info#packaging-option",
                    },
                ],
            },
            {
                label: t("newsArticles"),
                href: "/news",
            },
            {
                label: t("contact"),
                href: "/contact-us",
            },
        ],
        [t, productSubmenus]
    );

    return menuItems;
}
