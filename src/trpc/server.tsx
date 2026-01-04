import { headers } from "next/headers";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./routers/_app";

export const trpcServer = async () => {
  const h = await headers();

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
        headers: () => {
          const result: Record<string, string> = {};
          h.forEach((value, key) => {
            result[key] = value;
          });
          return result;
        },
      }),
    ],
  });
};
