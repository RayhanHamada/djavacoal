import authContract from "@/backend/handlers/auth.contract";
import { RootContext } from "@/backend/handlers/utils";
import { implement } from "@orpc/server";
import { faker } from "@faker-js/faker";

const implementation = implement(authContract)
  .$context<RootContext>()

  /**
   * register scoped middleware
   */
  .use(async function (opt) {
    return opt.next();
  });

const router = {
  login: implementation.login.handler(async function ({}) {
    // TODO: implement

    return {
      body: {
        data: {
          access_token: faker.internet.jwt(),
          refresh_token: faker.internet.jwt(),
        },
      },
    };
  }),

  refreshToken: implementation.refreshToken.handler(async function ({}) {
    // TODO: implement

    return {
      body: {
        data: {
          access_token: faker.internet.jwt(),
          refresh_token: faker.internet.jwt(),
        },
      },
    };
  }),

  logout: implementation.logout.handler(async function ({}) {
    // TODO: implement
  }),

  forgotPassword: implementation.forgotPassword.handler(async function ({}) {
    // TODO: implement
  }),

  resetPassword: implementation.resetPassword.handler(async function ({}) {
    // TODO: implement
  }),
};

export default router;
