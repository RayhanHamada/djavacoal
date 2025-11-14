import { $api } from "@/adapters/public-api/client";

export function useHomeContentAPI() {
    return $api.useQuery("get", "/home-content");
}

export function useFooterContentAPI() {
    return $api.useQuery("get", "/footer-content");
}

export function useListProductNamesAPI(limit: number = 5) {
    return $api.useQuery("get", "/products-names", {
        query: {
            limit,
        },
    });
}

export function useAboutCompanyContentAPI() {
    return $api.useQuery("get", "/about-company-content");
}

export function useProductionInfoContentAPI() {
    return $api.useQuery("get", "/packaging-info-content");
}

export function useContactInfoContentAPI() {
    return $api.useQuery("get", "/getContactUs");
}

export function useNewsListAPI({
    page = 1,
    limit = 10,
    search,
}: {
    page?: number;
    limit?: number;
    search?: string;
} = {}) {
    return $api.useQuery("get", "/news", {
        query: {
            page,
            limit,
            search,
        },
    });
}
