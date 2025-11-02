import "client-only";
import createQueryClient from "openapi-react-query";

import { _publicApiClient as publicApiClient } from "@/adapters/public-api/api-client";

const $api = createQueryClient(publicApiClient);

export { publicApiClient, $api };
