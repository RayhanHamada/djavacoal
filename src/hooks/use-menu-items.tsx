"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

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
                        href: "/about#cv-djavacoal-indonesia",
                    },
                    {
                        label: t("aboutCompanySubmenus.team"),
                        href: "/about#djavacoals-team",
                    },
                    {
                        label: t("aboutCompanySubmenus.whatWeDo"),
                        href: "/about#what-we-do",
                    },
                    {
                        label: t("aboutCompanySubmenus.legalCertificate"),
                        href: "/about#legal-certificate",
                    },
                    {
                        label: t("aboutCompanySubmenus.factory"),
                        href: "/about#factory",
                    },
                    {
                        label: t("aboutCompanySubmenus.gallery"),
                        href: "/about#our-gallery",
                    },
                ],
            },
            {
                label: t("ourProducts"),
                submenus: [
                    {
                        label: "Coal",
                        href: "/our-products/coal",
                    },
                    {
                        label: "Hardwood Charcoal",
                        href: "/our-products/hardwood-charcoal",
                    },
                    {
                        label: "Coconut Shell Charcoal",
                        href: "/our-products/coconut-shell-charcoal",
                    },
                    {
                        label: "Bamboo Charcoal",
                        href: "/our-products/bamboo-charcoal",
                    },
                ],
            },
            {
                label: t("productionInfo"),
                submenus: [
                    {
                        label: t("productionInfoSubmenus.process"),
                        href: "/production-info#production-process",
                    },
                    {
                        label: t("productionInfoSubmenus.shipment"),
                        href: "/production-info#shipment-terms",
                    },
                    {
                        label: t("productionInfoSubmenus.moqPayment"),
                        href: "/production-info#moq-payment-terms",
                    },
                    {
                        label: t("productionInfoSubmenus.faq"),
                        href: "/production-info#faq",
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
        [t]
    );

    return menuItems;
}
