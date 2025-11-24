import { z } from "zod";

import {
    FAQ_ANSWER_MAX_LENGTH,
    FAQ_ANSWER_MIN_LENGTH,
    FAQ_QUESTION_MAX_LENGTH,
    FAQ_QUESTION_MIN_LENGTH,
} from "../lib/constants";

/**
 * FAQ list item schema
 */
export const FaqListItemSchema = z.object({
    id: z.number(),
    en_question: z.string(),
    ar_question: z.string(),
    en_answer: z.string(),
    ar_answer: z.string(),
    order_index: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type FaqListItem = z.infer<typeof FaqListItemSchema>;

/**
 * List FAQs output schema
 */
export const ListFaqsOutputSchema = z.object({
    faqs: z.array(FaqListItemSchema),
    total: z.number().int(),
});

export type ListFaqsOutput = z.infer<typeof ListFaqsOutputSchema>;

/**
 * Get FAQ by ID input schema
 */
export const GetFaqByIdInputSchema = z.object({
    id: z.number().int().positive(),
});

export type GetFaqByIdInput = z.infer<typeof GetFaqByIdInputSchema>;

/**
 * Get FAQ by ID output schema
 */
export const GetFaqByIdOutputSchema = z.object({
    id: z.number(),
    en_question: z.string(),
    ar_question: z.string(),
    en_answer: z.string(),
    ar_answer: z.string(),
    order_index: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type GetFaqByIdOutput = z.infer<typeof GetFaqByIdOutputSchema>;

/**
 * Create FAQ input schema (server function validation)
 */
export const CreateFaqInputSchema = z.object({
    en_question: z
        .string()
        .trim()
        .min(FAQ_QUESTION_MIN_LENGTH)
        .max(FAQ_QUESTION_MAX_LENGTH),
    ar_question: z
        .string()
        .trim()
        .max(FAQ_QUESTION_MAX_LENGTH)
        .optional()
        .default(""),
    en_answer: z
        .string()
        .trim()
        .min(FAQ_ANSWER_MIN_LENGTH)
        .max(FAQ_ANSWER_MAX_LENGTH),
    ar_answer: z
        .string()
        .trim()
        .max(FAQ_ANSWER_MAX_LENGTH)
        .optional()
        .default(""),
});

export type CreateFaqInput = z.infer<typeof CreateFaqInputSchema>;

/**
 * Create FAQ output schema
 */
export const CreateFaqOutputSchema = z.object({
    id: z.number(),
    en_question: z.string(),
    ar_question: z.string(),
    en_answer: z.string(),
    ar_answer: z.string(),
    order_index: z.number(),
});

export type CreateFaqOutput = z.infer<typeof CreateFaqOutputSchema>;

/**
 * Update FAQ input schema (server function validation)
 */
export const UpdateFaqInputSchema = z.object({
    id: z.number().int().positive(),
    en_question: z
        .string()
        .trim()
        .min(FAQ_QUESTION_MIN_LENGTH)
        .max(FAQ_QUESTION_MAX_LENGTH),
    ar_question: z
        .string()
        .trim()
        .max(FAQ_QUESTION_MAX_LENGTH)
        .optional()
        .default(""),
    en_answer: z
        .string()
        .trim()
        .min(FAQ_ANSWER_MIN_LENGTH)
        .max(FAQ_ANSWER_MAX_LENGTH),
    ar_answer: z
        .string()
        .trim()
        .max(FAQ_ANSWER_MAX_LENGTH)
        .optional()
        .default(""),
});

export type UpdateFaqInput = z.infer<typeof UpdateFaqInputSchema>;

/**
 * Delete FAQ input schema
 */
export const DeleteFaqInputSchema = z.object({
    id: z.number().int().positive(),
});

export type DeleteFaqInput = z.infer<typeof DeleteFaqInputSchema>;

/**
 * Reorder FAQs input schema
 */
export const ReorderFaqsInputSchema = z.object({
    /** Array of FAQ IDs in their new order */
    order: z.array(z.number().int().positive()),
});

export type ReorderFaqsInput = z.infer<typeof ReorderFaqsInputSchema>;
