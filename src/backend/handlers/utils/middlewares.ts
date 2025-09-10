import { os } from "@orpc/server";
import { v7 } from "uuid";

const context = {
  user: "test123123",
} as const;

export const middlewares = {
  globalContext: os.middleware(async function (opt) {
    return opt.next({
      context: {
        ...opt.context,
        ...context,
      },
    });
  }),

  requestID: os.middleware(async function (opt) {
    return opt.next({
      context: {
        requestID: v7(),
      },
    });
  }),
};
