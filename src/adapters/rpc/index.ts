import "server-only";

import { onError, ORPCError } from "@orpc/client";
import { ValidationError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import z from "zod";

import { RPC_API_PREFIX } from "@/adapters/rpc/constants";
import { router as admins } from "@/features/dashboard-auth/server/router";
import { router as dashboardFaqs } from "@/features/dashboard-faqs/server";
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
    dashboardFaqs,
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

            const map = {
                BAD_REQUEST: {
                    code: "INPUT_VALIDATION_ERROR",
                    status: 422,
                },
                INTERNAL_SERVER_ERROR: {
                    code: "OUTPUT_VALIDATION_ERROR",
                    status: 500,
                },
            } as const;

            const m = map[errorCode as keyof typeof map];
            const err = m
                ? new ORPCError(m.code, {
                      status: m.status,
                      message,
                      data,
                      cause,
                  })
                : null;

            if (err) throw err;
        }),
    ],
});
export default async function getHandler(request: Request) {
    return handler.handle(request, {
        prefix: RPC_API_PREFIX,
    });
}

export type Router = typeof router;
