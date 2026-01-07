import { headers } from "next/headers";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./routers/_app";
import { makeQueryClient } from "./query-client";

// ✅ Server-side TRPC client
export const trpcServer = async () => {
  const h = await headers();

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
        headers: () => {
          const result: Record<string, string> = {};
          h.forEach((value, key) => (result[key] = value));
          return result;
        },
      }),
    ],
  });
};

// ✅ Get or create a query client
export const getQueryClient = () => makeQueryClient();

// ✅ Use TRPC options proxy (no deprecated calls)
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy({
  client,
  queryClient: getQueryClient(),
});
