import React, { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { AgentIdViewLoading, AgentIdViewError } from "@/modules/agents/ui/views/agent-id-view";
import { ErrorBoundary } from "react-error-boundary";
import { AgentIdView } from "@/modules/agents/ui/views/agent-id-view";
interface Props {
  params: Promise<{ agentId: string }>;
}

const Page = async ({ params }: Props) => {
  const { agentId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 🔒 Security gate
  if (!session) {
    redirect("/sign-in");
  }

  // ✅ Only runs for authenticated users
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(
      trpc.agents.getOne.queryOptions({
        id: agentId,
      })
    );
  } catch (error) {
    // If agent not found or access denied, show 404
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentIdViewLoading />}>
      <ErrorBoundary fallback={<AgentIdViewError />}>
        <AgentIdView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;