import getHandler from "@/adapters/rpc";

async function handleRequest(request: Request) {
    const { response } = (await getHandler(request)) ?? {};
    return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
