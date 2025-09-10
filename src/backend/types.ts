import { NextRequest, NextResponse } from "next/server";

export type NextRouteHandler = (
  req: NextRequest
) => Promise<Response | NextResponse>;
