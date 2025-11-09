import { z } from "zod/v4";

/**
 * Public API Schemas
 * These schemas define the input/output for public API endpoints
 */

// ============================================
// Product Schemas
// ============================================

export const LIST_PRODUCT_NAME_QUERY_INPUT_SCHEMA = z
    .object({
        limit: z
            .number()
            .min(5)
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
