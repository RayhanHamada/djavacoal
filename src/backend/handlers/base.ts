import { middlewares, onErrorCallback } from "@/backend/handlers/utils";
import { oc } from "@orpc/contract";
import { onError, os } from "@orpc/server";
import { z } from "zod/v4";

const baseOc = oc.errors({
  NOT_FOUND: {
    message: "Resource not found.",
    data: z.null().default(null),
  },
  INTERNAL_SERVER_ERROR: {
    message: "An unexpected error occurred. Please try again later.",
    data: z.record(z.string(), z.unknown()).nullable().default(null),
  },
  INPUT_VALIDATION_FAILED: {
    status: 422,
    data: z.object({
      formErrors: z.array(z.object()),
      fieldErrors: z.object({
        body: z.array(z.string()).optional(),
        query: z.array(z.string()).optional(),
        path: z.array(z.string()).optional(),
        header: z.array(z.string()).optional(),
      }),
    }),
  },
  OUTPUT_VALIDATION_FAILED: {
    status: 422,
    data: z.object({
      formErrors: z.array(z.object()),
      fieldErrors: z.object({
        body: z.array(z.string()).optional(),
        header: z.array(z.string()).optional(),
      }),
    }),
  },
});

const baseOs = os
  /**
   * register global middleware
   */
  .use(middlewares.globalContext)
  .use(middlewares.requestID)
  .use(onError(onErrorCallback));

export { baseOc, baseOs };
