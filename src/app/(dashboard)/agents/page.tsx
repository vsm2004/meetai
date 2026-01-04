import React, { Suspense } from "react";
import { AgentsView, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";
import { createTRPCContext, createCallerFactory } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const params = await loadSearchParams(searchParams);

  // 🔒 Auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Server-side prefetch using tRPC caller
  const queryClient = new QueryClient();
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller(await createTRPCContext());
  
  try {
    const data = await caller.agents.getMany(params);
    queryClient.setQueryData(["agents.getMany", params], data);
  } catch (err) {
    console.error("Failed to prefetch agents:", err);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <AgentsView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
