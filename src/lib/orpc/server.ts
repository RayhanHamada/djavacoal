import { os } from "@orpc/server";
import { z } from "zod/v4";

import { injectCFContext } from "@/lib/orpc/middlewares";

const base = os
    .errors({
        UNAUTHORIZED: {
            message: "You are not authorized to perform this action.",
            data: z.nullish(z.object()),
        },
        NOT_FOUND: {
            message: "The requested resource was not found.",
            data: z.nullish(z.object()),
        },
        BAD_REQUEST: {
            message: "The request was invalid or cannot be served.",
            data: z.nullish(z.object()),
        },
        INTERNAL_SERVER_ERROR: {
            message: "An internal server error occurred.",
            data: z.nullish(z.object()),
        },
    })
    .use(injectCFContext);

export default base;
