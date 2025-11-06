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
