import auth from "@/backend/handlers/auth.implementation";
import { baseOs } from "@/backend/handlers/base";

export default baseOs

  /**
   * register routes
   */
  .router({
    auth: baseOs.prefix("/auth").router(auth),
  });
