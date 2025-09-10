import { NextResponse } from "next/server";
import type { NextMiddleware } from "next/server";

export const middleware: NextMiddleware = function () {
  return NextResponse.next();
};

// Optional: Configure which paths this middleware runs on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
