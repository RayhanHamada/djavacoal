import "server-only";

import { headers } from "next/headers";

import { eq, sql } from "drizzle-orm";

import {
    CreateFaqInputSchema,
    CreateFaqOutputSchema,
    DeleteFaqInputSchema,
    GetFaqByIdInputSchema,
    GetFaqByIdOutputSchema,
    ListFaqsOutputSchema,
    ReorderFaqsInputSchema,
    UpdateFaqInputSchema,
} from "./schemas";
import { COMMON_COLUMNS, FAQ_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { faqs } from "@/adapters/d1/schema";
import { getAuth } from "@/features/dashboard-auth/lib/better-auth-server";
import base from "@/lib/orpc/server";

/**
 * List all FAQs ordered by order_index
 */
export const listFaqs = base
    .output(ListFaqsOutputSchema)
    .handler(async function ({ context: { env } }) {
        const db = getDB(env.DJAVACOAL_DB);

        const faqList = await db
            .select({
                id: faqs[COMMON_COLUMNS.ID],
                en_question: faqs[FAQ_COLUMNS.EN_QUESTION],
                ar_question: faqs[FAQ_COLUMNS.AR_QUESTION],
                en_answer: faqs[FAQ_COLUMNS.EN_ANSWER],
                ar_answer: faqs[FAQ_COLUMNS.AR_ANSWER],
                order_index: faqs[FAQ_COLUMNS.ORDER_INDEX],
                created_at: faqs[COMMON_COLUMNS.CREATED_AT],
                updated_at: faqs[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(faqs)
            .orderBy(faqs[FAQ_COLUMNS.ORDER_INDEX]);

        return {
            faqs: faqList,
            total: faqList.length,
        };
    })
    .callable();

/**
 * Get a single FAQ by ID
 */
export const getFaqById = base
    .input(GetFaqByIdInputSchema)
    .output(GetFaqByIdOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);

        const result = await db
            .select({
                id: faqs[COMMON_COLUMNS.ID],
                en_question: faqs[FAQ_COLUMNS.EN_QUESTION],
                ar_question: faqs[FAQ_COLUMNS.AR_QUESTION],
                en_answer: faqs[FAQ_COLUMNS.EN_ANSWER],
                ar_answer: faqs[FAQ_COLUMNS.AR_ANSWER],
                order_index: faqs[FAQ_COLUMNS.ORDER_INDEX],
                created_at: faqs[COMMON_COLUMNS.CREATED_AT],
                updated_at: faqs[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(faqs)
            .where(eq(faqs[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const faq = result.at(0);

        if (!faq) {
            throw errors.NOT_FOUND({ message: "FAQ not found" });
        }

        return faq;
    })
    .callable();

/**
 * Create a new FAQ
 */
export const createFaq = base
    .input(CreateFaqInputSchema)
    .output(CreateFaqOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Get max order_index to add new FAQ at the bottom
        const maxOrderResult = await db
            .select({
                maxOrder: sql<number>`MAX(${faqs[FAQ_COLUMNS.ORDER_INDEX]})`,
            })
            .from(faqs);

        const nextOrder = (maxOrderResult.at(0)?.maxOrder ?? -1) + 1;

        // Insert FAQ
        const result = await db
            .insert(faqs)
            .values({
                en_question: input.en_question,
                ar_question: input.ar_question || "",
                en_answer: input.en_answer,
                ar_answer: input.ar_answer || "",
                order_index: nextOrder,
            })
            .returning({
                id: faqs[COMMON_COLUMNS.ID],
                en_question: faqs[FAQ_COLUMNS.EN_QUESTION],
                ar_question: faqs[FAQ_COLUMNS.AR_QUESTION],
                en_answer: faqs[FAQ_COLUMNS.EN_ANSWER],
                ar_answer: faqs[FAQ_COLUMNS.AR_ANSWER],
                order_index: faqs[FAQ_COLUMNS.ORDER_INDEX],
            });

        const faq = result.at(0);

        if (!faq) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to create FAQ",
            });
        }

        return faq;
    })
    .callable();

/**
 * Update an existing FAQ
 */
export const updateFaq = base
    .input(UpdateFaqInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Check if FAQ exists
        const existing = await db
            .select()
            .from(faqs)
            .where(eq(faqs[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const faq = existing.at(0);

        if (!faq) {
            throw errors.NOT_FOUND({ message: "FAQ not found" });
        }

        // Update FAQ
        await db
            .update(faqs)
            .set({
                en_question: input.en_question,
                ar_question: input.ar_question || "",
                en_answer: input.en_answer,
                ar_answer: input.ar_answer || "",
            })
            .where(eq(faqs[COMMON_COLUMNS.ID], input.id));

        return { success: true };
    })
    .callable();

/**
 * Delete a FAQ
 */
export const deleteFaq = base
    .input(DeleteFaqInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Check if FAQ exists
        const existing = await db
            .select()
            .from(faqs)
            .where(eq(faqs[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const faq = existing.at(0);

        if (!faq) {
            throw errors.NOT_FOUND({ message: "FAQ not found" });
        }

        // Delete FAQ
        await db.delete(faqs).where(eq(faqs[COMMON_COLUMNS.ID], input.id));

        // Reorder remaining FAQs
        const remainingFaqs = await db
            .select({
                id: faqs[COMMON_COLUMNS.ID],
            })
            .from(faqs)
            .orderBy(faqs[FAQ_COLUMNS.ORDER_INDEX]);

        for (let i = 0; i < remainingFaqs.length; i++) {
            await db
                .update(faqs)
                .set({ order_index: i })
                .where(eq(faqs[COMMON_COLUMNS.ID], remainingFaqs[i].id));
        }

        return { success: true };
    })
    .callable();

/**
 * Reorder FAQs
 */
export const reorderFaqs = base
    .input(ReorderFaqsInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Update order_index for each FAQ
        for (let i = 0; i < input.order.length; i++) {
            await db
                .update(faqs)
                .set({ order_index: i })
                .where(eq(faqs[COMMON_COLUMNS.ID], input.order[i]));
        }

        return { success: true };
    })
    .callable();

/**
 * Get total count of FAQs
 */
export const getFaqCount = base
    .handler(async function ({ context: { env }, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const total = await db.$count(faqs);

        return {
            count: total,
        };
    })
    .callable();
