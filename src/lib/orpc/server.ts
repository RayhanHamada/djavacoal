import { os } from "@orpc/server";
import z from "zod/v4";

import { injectCFContext } from "@/lib/orpc/middlewares";

const base = os
    .errors({
        NOT_FOUND: {
            message: "The requested resource was not found.",
            data: z.nullish(z.object()),
        },
        BAD_REQUEST: {},
        INTERNAL_SERVER_ERROR: {
            message: "An internal server error occurred.",
            data: z.nullish(z.object()),
        },
    })
    .use(injectCFContext);

export default base;
