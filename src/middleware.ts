import type { MiddlewareConfig, NextMiddleware } from "next/server";

import { NextResponse } from "next/server";

export const middleware: NextMiddleware = function (request) {
    const headers = new Headers(request.headers);
    headers.set("x-pathname", request.nextUrl.pathname);

    return NextResponse.next({
        headers,
    });
};

// Optional: Configure which paths this middleware runs on
export const config: MiddlewareConfig = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
