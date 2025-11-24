import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import {
    FAQ_ANSWER_MAX_LENGTH,
    FAQ_ANSWER_MIN_LENGTH,
    FAQ_QUESTION_MAX_LENGTH,
    FAQ_QUESTION_MIN_LENGTH,
} from "./constants";

/**
 * Form schema for creating FAQ
 * Used by Mantine Form with validation
 */
export const CreateFaqFormSchema = z.object({
    en_question: z
        .string()
        .trim()
        .min(
            FAQ_QUESTION_MIN_LENGTH,
            `English question must be at least ${FAQ_QUESTION_MIN_LENGTH} characters`
        )
        .max(
            FAQ_QUESTION_MAX_LENGTH,
            `English question must be at most ${FAQ_QUESTION_MAX_LENGTH} characters`
        ),
    ar_question: z
        .string()
        .trim()
        .max(
            FAQ_QUESTION_MAX_LENGTH,
            `Arabic question must be at most ${FAQ_QUESTION_MAX_LENGTH} characters`
        )
        .optional()
        .default(""),
    en_answer: z
        .string()
        .trim()
        .min(
            FAQ_ANSWER_MIN_LENGTH,
            `English answer must be at least ${FAQ_ANSWER_MIN_LENGTH} characters`
        )
        .max(
            FAQ_ANSWER_MAX_LENGTH,
            `English answer must be at most ${FAQ_ANSWER_MAX_LENGTH} characters`
        ),
    ar_answer: z
        .string()
        .trim()
        .max(
            FAQ_ANSWER_MAX_LENGTH,
            `Arabic answer must be at most ${FAQ_ANSWER_MAX_LENGTH} characters`
        )
        .optional()
        .default(""),
});

export const validateCreateFaqForm = zod4Resolver(CreateFaqFormSchema);
export type CreateFaqFormInput = z.infer<typeof CreateFaqFormSchema>;

/**
 * Form schema for updating FAQ
 * Used by Mantine Form with validation
 */
export const UpdateFaqFormSchema = z.object({
    id: z.number().int().positive(),
    en_question: z
        .string()
        .trim()
        .min(
            FAQ_QUESTION_MIN_LENGTH,
            `English question must be at least ${FAQ_QUESTION_MIN_LENGTH} characters`
        )
        .max(
            FAQ_QUESTION_MAX_LENGTH,
            `English question must be at most ${FAQ_QUESTION_MAX_LENGTH} characters`
        ),
    ar_question: z
        .string()
        .trim()
        .max(
            FAQ_QUESTION_MAX_LENGTH,
            `Arabic question must be at most ${FAQ_QUESTION_MAX_LENGTH} characters`
        )
        .optional()
        .default(""),
    en_answer: z
        .string()
        .trim()
        .min(
            FAQ_ANSWER_MIN_LENGTH,
            `English answer must be at least ${FAQ_ANSWER_MIN_LENGTH} characters`
        )
        .max(
            FAQ_ANSWER_MAX_LENGTH,
            `English answer must be at most ${FAQ_ANSWER_MAX_LENGTH} characters`
        ),
    ar_answer: z
        .string()
        .trim()
        .max(
            FAQ_ANSWER_MAX_LENGTH,
            `Arabic answer must be at most ${FAQ_ANSWER_MAX_LENGTH} characters`
        )
        .optional()
        .default(""),
});

export const validateUpdateFaqForm = zod4Resolver(UpdateFaqFormSchema);
export type UpdateFaqFormInput = z.infer<typeof UpdateFaqFormSchema>;
