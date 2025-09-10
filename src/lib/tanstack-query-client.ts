import { tanstackQueryConfig } from "@/configs";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient(tanstackQueryConfig);
