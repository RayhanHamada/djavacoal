import "server-only";

import { onError, ORPCError } from "@orpc/client";
import { ValidationError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import z from "zod";

import { RPC_API_PREFIX } from "@/adapters/rpc/constants";
import { router as admins } from "@/features/dashboard-auth/server/router";
import { router as gallery } from "@/features/dashboard-gallery/server/router";
import { router as dashboardNews } from "@/features/dashboard-news/server";
import { router as pageSettings } from "@/features/dashboard-page-settings/server";
import { router as dashboardProduct } from "@/features/dashboard-product/server";
import { router as staticMedia } from "@/features/dashboard-static-media/server/router";
import { router as dashboardTeamMember } from "@/features/dashboard-team-member/server";

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
    dashboardTeamMember,
};

const handler = new RPCHandler(router, {
    clientInterceptors: [
        onError(async function (error) {
            /**
             * skip check if not ORPCError or not ValidationError
             */
            if (!(error instanceof ORPCError)) return;
            if (!(error.cause instanceof ValidationError)) return;

            /**
             * convert to ZodError for better formatting
             */
            const zodError = new z.ZodError(
                error.cause.issues as z.core.$ZodIssue[]
            );
            const errorCode = error.code;
            const message = z.prettifyError(zodError);
            const data = z.flattenError(zodError);
            const cause = error.cause;

            /**
             * assumes BAD_REQUEST is input validation error
             */
            if (errorCode === "BAD_REQUEST") {
                throw new ORPCError("INPUT_VALIDATION_ERROR", {
                    status: 422,
                    message,
                    data,
                    cause,
                });
            }

            /**
             * assumes INTERNAL_SERVER_ERROR is output validation error
             */
            if (errorCode === "INTERNAL_SERVER_ERROR") {
                throw new ORPCError("OUTPUT_VALIDATION_ERROR", {
                    status: 500,
                    message,
                    data,
                    cause,
                });
            }
        }),
    ],
});
export default async function getHandler(request: Request) {
    return handler
        .handle(request, {
            prefix: RPC_API_PREFIX,
        })
        .catch((error) => {
            console.error("RPC Handler Error:", error);

            return;
        });
}

export type Router = typeof router;
