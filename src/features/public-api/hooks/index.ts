import { $api } from "@/adapters/public-api/client";

export function useHomeContentAPI() {
    return $api.useQuery("get", "/home-content");
}

export function useFooterContentAPI() {
    return $api.useQuery("get", "/footer-content");
}

export function useListProductNamesAPI() {
    return $api.useQuery("get", "/products-names", {
        query: {
            limit: 20,
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

export function usePublicFaqsAPI() {
    return $api.useQuery("get", "/faqs");
}

export function useProductDetailAPI(slug: string) {
    return $api.useQuery("get", "/products/{slug}", {
        params: {
            path: {
                slug,
            },
        },
    });
}

export function useNewsListAPI({
    page = 1,
    limit,
    search,
}: {
    page?: number;
    limit?: number;
    search?: string;
} = {}) {
    return $api.useQuery("get", "/news", {
        params: {
            query: {
                page: page,
                limit: limit,
                search,
            },
        },
    });
}

export function useRelatedArticlesAPI({
    limit,
}: {
    limit?: number;
} = {}) {
    return $api.useInfiniteQuery(
        "get",
        "/news",
        {
            params: {
                query: {
                    limit,
                },
            },
        },
        {
            pageParamName: "page",
            initialPageParam: 1,
            getNextPageParam(lastPage) {
                const hasMore =
                    lastPage.data.news.page !== lastPage.data.news.total_pages;

                if (hasMore) {
                    return lastPage.data.news.page + 1;
                }

                return null;
            },
        }
    );
}
