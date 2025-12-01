export type SitemapEntry = {
    loc: string;
    lastmod?: string | null;
    changefreq?:
        | "always"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "never";
    priority?: number;
};

export type SitemapIndexEntry = {
    loc: string;
    lastmod?: string | null;
};

export type StaticPageData = {
    path: string;
    priority: number | null;
    changefreq: string | null;
    updatedAt: Date | null;
};

export type BlogArticleData = {
    slug: string;
    updatedAt: Date | null;
};

export type ProductData = {
    id: number;
    updatedAt: Date | null;
};
