import { OpenAPIHandler } from "@orpc/openapi/fetch";
import router from "@/backend/handlers";
import { NextRouteHandler } from "@/backend/types";
import { API_PREFIX, plugins } from "@/backend/utils";

const handler = new OpenAPIHandler(router, { plugins });

export const handleRequest: NextRouteHandler = async function (req) {
  try {
    const { response } = await handler.handle(req, {
      prefix: API_PREFIX,
    });

    if (!response) {
      return new Response("Not found", { status: 404 });
    }

    return response;
  } catch (error) {
    console.log(error);

    return new Response("Internal Server Error", { status: 500 });
  }
};
