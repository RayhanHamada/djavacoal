import { z } from "zod/v4";

import { PRODUCT_MEDIA_TYPE } from "@/adapters/d1/constants";

/**
 * Public API Schemas
 * These schemas define the input/output for public API endpoints
 */

// ============================================
// Product Schemas
// ============================================

export const LIST_PRODUCT_NAME_QUERY_INPUT_SCHEMA = z
    .object({
        limit: z.coerce
            .number()
            .default(5)
            .describe("Maximum number of product names to return"),
    })
    .default({
        limit: 5,
    });

export const LIST_PRODUCT_NAME_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        names: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                slug: z.string(),
            })
        ),
        meta: z.object({
            total: z.number(),
        }),
    }),
});

export const FOOTER_CONTENT_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        facebook_link: z.string().nullable(),
        linkedin_link: z.string().nullable(),
        instagram_link: z.string().nullable(),
        tiktok_link: z.string().nullable(),

        maps_link: z.string().nullable(),
        address: z.string().nullable(),
        phone_number: z.string().nullable(),
        email: z.string().nullable(),
    }),
});

export const HOME_CONTENT_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        slide_banners: z
            .array(z.url().describe("URL of the slide banner image"))
            .default([]),
        who_we_are_video_url: z
            .url()
            .nullable()
            .describe("URL of the 'Who We Are' video"),
        featured_products: z.array(
            z.object({
                id: z.number().describe("Product ID"),
                slug: z.string().describe("Product slug"),
                name: z.string().describe("Product name"),
                description: z.string().describe("Product description"),
                image_url: z.url().describe("URL of the product image"),
            })
        ),
        packaging_options: z.array(
            z.object({
                id: z.number().describe("Packaging option ID"),
                slug: z.string().describe("Packaging option slug"),
                type: z.string().describe("Type of packaging"),
                description: z
                    .string()
                    .describe("Description of the packaging"),
                image_url: z.url().describe("URL of the packaging image"),
            })
        ),
        visit_our_factory_photo: z
            .url()
            .nullable()
            .describe("URL of the factory photo"),
    }),
});

export const ABOUT_COMPANY_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        //
        team_members: z.array(
            z.object({
                id: z.number().describe("Team member ID"),
                name: z.string().describe("Team member name"),
                position: z.string().describe("Team member position"),
                photo_url: z.url().describe("URL of the team member photo"),
            })
        ),
        our_factory_photo: z
            .url()
            .nullable()
            .describe("URL of the factory photo"),

        reels: z.array(
            z.object({
                id: z.string().describe("Reel ID"),
                video_url: z.url().describe("URL of the reel video"),
            })
        ),

        factory_galleries: z.array(
            z.url().describe("URL of the gallery photo")
        ),

        product_galleries: z.array(
            z.url().describe("URL of the gallery photo")
        ),

        about_us_video_url: z
            .url()
            .nullable()
            .describe("URL of the 'About Us' video"),
    }),
});

export const PACKAGING_INFO_CONTENT_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        packaging_options: z.array(
            z.object({
                id: z.number().describe("Packaging option ID"),
                slug: z.string().describe("Packaging option slug"),
                type: z.string().describe("Type of packaging"),
                description: z
                    .string()
                    .describe("Description of the packaging"),
                image_url: z.url().describe("URL of the packaging image"),
            })
        ),
    }),
});

export const PRODUCT_DETAIL_PATH_INPUT_SCHEMA = z.object({
    id: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), {
            message: "Product ID must be a valid number",
        })
        .describe("The ID of the product to fetch details for"),
});

export const PRODUCT_DETAIL_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        id: z.number().describe("Product ID"),
        slug: z.string().describe("Product slug"),
        name: z.string().describe("Product name"),
        description: z.string().describe("Product description"),
        medias: z.array(
            z
                .object({
                    id: z.number().describe("Media ID"),
                })
                .and(
                    z.discriminatedUnion("type", [
                        z.object({
                            type: z
                                .literal(PRODUCT_MEDIA_TYPE.IMAGE)
                                .describe("Type of media"),
                            image_url: z
                                .url()
                                .describe("Image URL if media is an image"),
                        }),

                        z.object({
                            type: z
                                .literal(PRODUCT_MEDIA_TYPE.YOUTUBE)
                                .describe("Type of media"),
                            youtube_url: z
                                .url()
                                .describe("YouTube URL if media is a video"),
                            custom_thumbnail_url: z
                                .url()
                                .optional()
                                .describe("Custom thumbnail URL for the video"),
                        }),
                    ])
                )
        ),
        specifications: z.array(
            z.object({
                id: z.number().describe("Specification ID"),
                image_url: z.string().describe("Specification image URL"),
            })
        ),
        variants: z.array(
            z.object({
                id: z.number().describe("Variant ID"),
                name: z.string().describe("Variant name"),
                sizes: z.array(z.string().describe("Size")).describe("Sizes"),
                image_url: z.url().describe("URL of the variant photo"),
            })
        ),
        packaging_options: z.array(
            z.object({
                id: z.number().describe("Packaging option ID"),
                slug: z.string().describe("Packaging option slug"),
                type: z.string().describe("Type of packaging"),
                description: z
                    .string()
                    .describe("Description of the packaging"),
                image_url: z.url().describe("URL of the packaging image"),
            })
        ),
        moq: z.string().describe("Minimum Order Quantity"),
        production_capacity: z
            .string()
            .describe("Production capacity information"),
    }),
});

export type ProductDetailBodyOutputSchema = z.infer<
    typeof PRODUCT_DETAIL_BODY_OUTPUT_SCHEMA
>;

export const NEWS_LIST_QUERY_INPUT_SCHEMA = z
    .object({
        search: z
            .string()
            .optional()
            .describe("Search term to filter news articles"),
        page: z.coerce
            .number()
            .default(1)
            .describe("Page number for pagination"),
        limit: z.coerce
            .number()
            .default(10)
            .describe("Number of articles per page"),
    })
    .default({
        page: 1,
        limit: 10,
    });

export const NEWS_LIST_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        news: z.object({
            data: z.array(
                z.object({
                    id: z.number().describe("Article ID"),
                    slug: z.string().describe("Article slug"),
                    title: z.string().describe("Article title"),
                    published_at: z
                        .date()
                        .describe("Publication date of the article"),
                    cover_image_url: z
                        .url()
                        .nullable()
                        .describe("URL of the article's cover image"),
                })
            ),
            page: z.number().describe("Current page number"),
            limit: z.number().describe("Number of articles per page"),
            total_pages: z.number().describe("Total number of pages"),
        }),
    }),
});

export const NEWS_DETAIL_PARAMS_INPUT_SCHEMA = z.object({
    slug: z
        .string()
        .describe("The slug of the news article to fetch details for"),
});

export const NEWS_DETAIL_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        slug: z.string().describe("Article slug"),
        title: z.string().describe("Article title"),
        content: z.string().describe("Content of the article"),
        published_at: z.date().describe("Publication date of the article"),
        cover_image_url: z
            .url()
            .nullable()
            .describe("URL of the article's cover image"),
    }),
});

export const NEWS_METADATA_PARAMS_INPUT_SCHEMA = z.object({
    slug: z
        .string()
        .describe("The slug of the news article to fetch details for"),
});

export const NEWS_METADATA_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        meta_title: z.string().describe("Meta title"),
        meta_description: z
            .string()
            .describe("Meta description of the article"),
        cover_image_url: z
            .url()
            .nullable()
            .describe("URL of the article's cover image"),
        published_at: z.date().describe("Publication date of the article"),
    }),
});

export const CONTACT_US_BODY_OUTPUT_SCHEMA = z.object({
    data: z.object({
        contact_email: z
            .string()
            .nullable()
            .describe("Email address to send contact inquiries to"),
        contact_phone_number: z
            .string()
            .nullable()
            .describe("Phone number for contact inquiries"),
        contact_address_line: z
            .string()
            .nullable()
            .describe("Address line for contact inquiries"),
        facebook_link: z.url().nullable().describe("Facebook page link"),
        linkedin_link: z.url().nullable().describe("LinkedIn page link"),
        instagram_link: z.url().nullable().describe("Instagram page link"),
        tiktok_link: z.url().nullable().describe("TikTok page link"),
    }),
});

// ============================================
// FAQ Schemas
// ============================================

export const PUBLIC_FAQS_OUTPUT_SCHEMA = z.object({
    data: z.object({
        faqs: z
            .array(
                z.object({
                    id: z.number().describe("FAQ unique identifier"),
                    question: z
                        .string()
                        .describe("Localized FAQ question text"),
                    answer: z
                        .string()
                        .describe("Localized FAQ answer (HTML content)"),
                    order_index: z.number().describe("Display order index"),
                })
            )
            .describe("Array of FAQs ordered by order_index"),
        total: z.number().describe("Total number of FAQs"),
    }),
});
