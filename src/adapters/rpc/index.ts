import "server-only";

import { onError, ORPCError } from "@orpc/client";
import { ValidationError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import z from "zod/v4";

import { router as admins } from "@/features/admin-auth/server/router";
import { router as gallery } from "@/features/dashboard-gallery/server/router";
import { router as dashboardNews } from "@/features/dashboard-news/server";
import { router as pageSettings } from "@/features/dashboard-page-settings/server";
import { router as dashboardProduct } from "@/features/dashboard-product/server";
import { router as staticMedia } from "@/features/dashboard-static-media/server/router";

const router = {
    /**
     * Add your RPC methods here
     */
    admins,
    gallery,
    dashboardNews,
    dashboardProduct,
    pageSettings,
    staticMedia,
};

const handler = new RPCHandler(router, {
    clientInterceptors: [
        onError(async function (error) {
            if (error instanceof ORPCError) {
                if (
                    error.code === "BAD_REQUEST" &&
                    error.cause instanceof ValidationError
                ) {
                    const zodError = new z.ZodError(
                        error.cause.issues as z.core.$ZodIssue[]
                    );

                    throw new ORPCError("INPUT_VALIDATION_ERROR", {
                        status: 422,
                        message: z.prettifyError(zodError),
                        data: z.flattenError(zodError),
                        cause: error.cause,
                    });
                }

                if (
                    error.code === "INTERNAL_SERVER_ERROR" &&
                    error.cause instanceof ValidationError
                ) {
                    const zodError = new z.ZodError(
                        error.cause.issues as z.core.$ZodIssue[]
                    );

                    throw new ORPCError("OUTPUT_VALIDATION_ERROR", {
                        status: 500,
                        message: z.prettifyError(zodError),
                        data: z.flattenError(zodError),
                        cause: error.cause,
                    });
                }
            }

            console.log(error);
        }),
    ],
});
export default async function getHandler(request: Request) {
    return handler
        .handle(request, {
            prefix: "/api/rpc",
        })
        .catch((error) => {
            console.error("RPC Handler Error:", error);

            return;
        });
}

export type Router = typeof router;
