import { z } from "zod/v4";
import constants from "@/backend/handlers/auth.constants";
import { baseOc } from "@/backend/handlers/base";

const tags = ["Auth"] as const;

const contract = {
  login: baseOc
    .route({
      tags,
      summary: "User Login",
      description: "Authenticate a user and return a JWT token.",
      method: "POST",
      path: "/login",
      inputStructure: "detailed",
      outputStructure: "detailed",
      spec(current) {
        return {
          ...current,
          security: [],
        };
      },
    })
    .input(
      z.object({
        body: z.object({
          email: z.email(constants.LOGIN.EMAIL_INVALID_MSG),
          password: z
            .string()
            .min(
              constants.LOGIN.PASSWORD_LENGTH_MIN,
              constants.LOGIN.PASSWORD_INVALID_MSG
            ),
        }),
      })
    )
    .output(
      z.object({
        body: z.object({
          data: z.object({
            access_token: z.jwt(),
            refresh_token: z.jwt(),
          }),
        }),
      })
    )
    .errors({
      INVALID_CREDENTIALS: {
        status: 401,
        message: "Invalid email or password.",
        data: z.null().default(null),
      },
    }),

  refreshToken: baseOc
    .route({
      tags,
      summary: "Refresh Token",
      description: "Refresh the user's JWT token.",
      method: "POST",
      path: "/refresh-token",
      inputStructure: "detailed",
      outputStructure: "detailed",
    })
    .input(
      z.object({
        headers: z.object({
          authorization: z.string(),
        }),
      })
    )
    .output(
      z.object({
        body: z.object({
          data: z.object({
            access_token: z.jwt(),
            refresh_token: z.jwt(),
          }),
        }),
      })
    ),

  logout: baseOc
    .route({
      tags,
      summary: "User Logout",
      description: "Log out the user and invalidate the JWT token.",
      method: "POST",
      path: "/logout",
      inputStructure: "detailed",
    })
    .input(
      z.object({
        headers: z.object({
          authorization: z.string().startsWith("Bearer "),
        }),
      })
    ),

  forgotPassword: baseOc
    .route({
      tags,
      summary: "Forgot Password",
      description: "Send a password reset email to the user.",
      method: "POST",
      path: "/forgot-password",
      inputStructure: "detailed",
      spec(current) {
        return {
          ...current,
          security: [],
        };
      },
    })
    .input(
      z.object({
        body: z.object({
          email: z.email(constants.LOGIN.EMAIL_INVALID_MSG),
        }),
      })
    ),
  resetPassword: baseOc
    .route({
      tags,
      summary: "Reset Password",
      description: "Reset the user's password.",
      method: "POST",
      path: "/reset-password",
      inputStructure: "detailed",
      spec(current) {
        return {
          ...current,
          security: [],
        };
      },
    })
    .input(
      z.object({
        query: z.object({
          token: z.nanoid(constants.RESET_PASSWORD.TOKEN_INVALID_MSG).meta({
            examples: "V1StGXR8_Z5jdHi6B-myT",
          }),
        }),
        body: z.object({
          new_password: z
            .string()
            .min(
              constants.RESET_PASSWORD.NEW_PASSWORD_LENGTH_MIN,
              constants.RESET_PASSWORD.NEW_PASSWORD_INVALID_MSG
            ),
        }),
      })
    ),
};

export default contract;
