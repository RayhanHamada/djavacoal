import { ORPCError, ValidationError } from "@orpc/server";
import { z } from "zod/v4";

export const onErrorCallback = (error: unknown) => {
  console.log("Error caught in onErrorCallback:", error);

  if (!(error instanceof ORPCError)) {
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      cause: (error as Error).cause,
    });
  }

  if (error.code === "BAD_REQUEST" && error.cause instanceof ValidationError) {
    // If you only use Zod you can safely cast to ZodIssue[]
    const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

    throw new ORPCError("INPUT_VALIDATION_FAILED", {
      status: 422,
      message: z.prettifyError(zodError),
      data: z.flattenError(zodError),
      cause: error.cause,
    });
  }

  if (error.code === "INTERNAL_SERVER_ERROR") {
    if (error.cause instanceof ValidationError) {
      const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

      throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
        cause: error.cause,
        message: z.prettifyError(zodError),
        data: z.flattenError(zodError),
      });
    }

    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      cause: error.cause,
    });
  }
};
