"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { $api } from "@/adapters/public-api/client";
import { SECTIONS_ELEMENTS_ID } from "@/configs";

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
            namesData?.data?.names.map(({ name, slug }) => ({
                label: name,
                href: `/our-products#${slug}`,
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
                        href: `/about-company#${SECTIONS_ELEMENTS_ID.ABOUT_COMPANY.PT_DJAVACOAL_INDONESIA}`,
                    },
                    {
                        label: t("aboutCompanySubmenus.team"),
                        href: `/about-company#${SECTIONS_ELEMENTS_ID.ABOUT_COMPANY.DJAVACOALS_TEAM}`,
                    },
                    {
                        label: t("aboutCompanySubmenus.whatWeDo"),
                        href: `/about-company#${SECTIONS_ELEMENTS_ID.ABOUT_COMPANY.WHAT_WE_DO}`,
                    },
                    {
                        label: t("aboutCompanySubmenus.legalCertificate"),
                        href: `/about-company#${SECTIONS_ELEMENTS_ID.ABOUT_COMPANY.LEGAL_CERTIFICATE}`,
                    },
                    {
                        label: t("aboutCompanySubmenus.factory"),
                        href: `/about-company#${SECTIONS_ELEMENTS_ID.ABOUT_COMPANY.FACTORY}`,
                    },
                    {
                        label: t("aboutCompanySubmenus.gallery"),
                        href: `/about-company#${SECTIONS_ELEMENTS_ID.ABOUT_COMPANY.OUR_GALLERY}`,
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
                        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.PRODUCTION_PROCESS}`,
                    },
                    {
                        label: t("productionInfoSubmenus.moqPayment"),
                        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.MOQ_PAYMENT_TERMS}`,
                    },
                    {
                        label: t("productionInfoSubmenus.shipment"),
                        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.SHIPMENT_TERMS}`,
                    },
                    {
                        label: t("productionInfoSubmenus.packagingOption"),
                        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.PACKAGING_INFO}`,
                    },
                    {
                        label: t("productionInfoSubmenus.faq"),
                        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.FAQS}`,
                    },
                ],
            },
            {
                label: t("newsArticles"),
                href: "/blog",
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
