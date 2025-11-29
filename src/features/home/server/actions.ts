"use server";

import type { NewsItem } from "@/features/home/lib/types";

import { cookies } from "next/headers";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
    COMMON_COLUMNS,
    NEWS_COLUMNS,
    NEWS_STATUS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { COOKIE_NAME, LOCALES } from "@/configs";

/**
 * Fetch pinned news articles for the home page
 * Returns localized news based on user's locale cookie
 */
export async function getPinnedNewsForHome(): Promise<NewsItem[]> {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDB(env.DJAVACOAL_DB);

    const cookieStore = await cookies();
    const locale = cookieStore.get(COOKIE_NAME.LOCALE)?.value ?? LOCALES.EN;
    const isArabic = locale === LOCALES.AR;

    const now = new Date();

    const pinnedNews = await db.query.news.findMany({
        columns: {
            id: true,
            slug: true,
            ar_title: true,
            en_title: true,
            published_at: true,
            image_key: true,
        },
        where(fields, operators) {
            return operators.and(
                operators.eq(fields[NEWS_COLUMNS.IS_PINNED_TO_HOME], true),
                operators.eq(
                    fields[NEWS_COLUMNS.STATUS],
                    NEWS_STATUS.PUBLISHED
                ),
                operators.isNotNull(fields[NEWS_COLUMNS.PUBLISHED_AT]),
                operators.lte(fields[NEWS_COLUMNS.PUBLISHED_AT], now)
            );
        },
        orderBy(fields, operators) {
            return [operators.desc(fields[NEWS_COLUMNS.PUBLISHED_AT])];
        },
        limit: 7,
    });

    return pinnedNews.map((item) => ({
        id: item[COMMON_COLUMNS.ID],
        slug: item[NEWS_COLUMNS.SLUG],
        title: isArabic
            ? item[NEWS_COLUMNS.AR_TITLE]
            : item[NEWS_COLUMNS.EN_TITLE],
        publishedAt: item[NEWS_COLUMNS.PUBLISHED_AT]!.toISOString(),
        coverImage: item[NEWS_COLUMNS.IMAGE_KEY]
            ? new URL(
                  item[NEWS_COLUMNS.IMAGE_KEY]!,
                  process.env.NEXT_PUBLIC_ASSET_URL
              ).toString()
            : null,
    }));
}
