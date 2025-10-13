import { getCloudflareContext } from "@opennextjs/cloudflare";
import { os } from "@orpc/server";

export const injectCFContext = os.middleware(async function (opts) {
  const cfCtx = await getCloudflareContext({ async: true });

  return opts.next({
    context: {
      ...cfCtx,
    },
  });
});
