import { createMiddleware, createSafeActionClient } from "next-safe-action";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * middlewares
 */
const injectCFContext = createMiddleware().define(async function ({ next }) {
  const context = await getCloudflareContext({ async: true });

  return next({
    ctx: {
      ...context,
    },
  });
});

export const safeActionClient = createSafeActionClient()
  /**
   * define middleware
   */
  .use(injectCFContext);
