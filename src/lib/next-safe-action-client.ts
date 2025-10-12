import { createMiddleware, createSafeActionClient } from "next-safe-action";

/**
 * middlewares
 */
const injectCFContext = createMiddleware().define(async function ({ next }) {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
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
