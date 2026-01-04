import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { createTRPCContext, createCallerFactory } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingIdView, MeetingsViewError } from "@/modules/meetings/ui/views/meeting-id-view";
import { MeetingsViewLoading } from "@/modules/meetings/ui/views/meeting-id-view";

interface Props{
  params:Promise<{
    meetingId: string;
  }>
}

const Page =  async({params}:Props) => {
  const { meetingId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if(!session){
    redirect("/sign-in"); 
  }
  const queryClient = new QueryClient();
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller(await createTRPCContext());
  
  try {
    const data = await caller.meetings.getOne({ id: meetingId });
    queryClient.setQueryData(["meetings.getOne", { id: meetingId }], data);
  } catch (err) {
    console.error("Failed to prefetch meeting:", err);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading/>}>
      <ErrorBoundary fallback={<MeetingsViewError/>}>
        <MeetingIdView meetingId={meetingId}/>
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page
