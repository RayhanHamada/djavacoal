import createClient from "openapi-fetch";

import { PUBLIC_API_PREFIX } from "./constants";
import { paths } from "./typegen";

export const _publicApiClient = createClient<paths>({
    baseUrl: new URL(
        PUBLIC_API_PREFIX,
        process.env.NEXT_PUBLIC_BASE_URL
    ).toString(),
});
