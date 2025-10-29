"use client";

import { useTranslations } from "next-intl";

import { NavigationMenuButton } from "@/components/atoms";

const MOCK_PRODUCTS = [
    {
        label: "Coal",
        href: "/products/coal",
    },
    {
        label: "Hardwood Charcoal",
        href: "/products/hardwood-charcoal",
    },
    {
        label: "Coconut Shell Charcoal",
        href: "/products/coconut-shell-charcoal",
    },
    {
        label: "Bamboo Charcoal",
        href: "/products/bamboo-charcoal",
    },
];

export function NavigationMenus() {
    const t = useTranslations("Navigation");

    return (
        <div className="flex h-full items-center gap-x-4 self-stretch">
            <NavigationMenuButton key="home" label={t("home")} href="/" />
            <NavigationMenuButton
                key="about"
                label={t("aboutCompany")}
                submenus={[
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
                ]}
            />
            <NavigationMenuButton
                key="our-products"
                label={t("ourProducts")}
                submenus={MOCK_PRODUCTS}
            />
            <NavigationMenuButton
                key="production-info"
                label={t("productionInfo")}
                submenus={[
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
                ]}
            />
            <NavigationMenuButton
                key="news-and-articles"
                label={t("newsArticles")}
                href="/news"
            />
            <NavigationMenuButton
                key="contact"
                label={t("contact")}
                href="/contact-us"
            />
        </div>
    );
}
