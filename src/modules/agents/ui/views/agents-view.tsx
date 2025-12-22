"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { AgentsListHeader } from "../components/agents-list-header";

export const AgentsView=()=>{
  const trpc=useTRPC();
  const {data}=useSuspenseQuery(trpc.agents.getMany.queryOptions());
return(
  <div>
    <AgentsListHeader/>
    {JSON.stringify(data,null,2)}
  </div>
)
}
export const AgentsViewLoading=()=>{
  return(
    <LoadingState
    title="loading agents"
    description="this may take a few seconds"
    />
  )
}
export const AgentsViewError=()=>{
  return(
    <ErrorState
    title=" error in loading agents"
    description="please try again later"
    />
  )
}