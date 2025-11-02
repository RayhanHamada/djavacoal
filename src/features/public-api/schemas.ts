import { z } from "zod/v4";

/**
 * Public API Schemas
 * These schemas define the input/output for public API endpoints
 */

// ============================================
// Product Schemas
// ============================================

export const LIST_PRODUCT_NAME_INPUT_SCHEMA = z.object({
    query: z
        .object({
            limit: z
                .number()
                .min(5)
                .default(5)
                .describe("Maximum number of product names to return"),
        })
        .default({
            limit: 5,
        }),
});

export const LIST_PRODUCT_NAME_OUTPUT_SCHEMA = z.object({
    body: z.object({
        data: z.object({
            names: z.array(
                z.object({
                    id: z.number(),
                    name: z.string(),
                })
            ),
            meta: z.object({
                total: z.number(),
            }),
        }),
    }),
});
