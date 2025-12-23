"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { EmptyState } from "@/components/empty-state";
import { AgentsListHeader } from "../components/agents-list-header";

export const AgentsView=()=>{
  const trpc=useTRPC();
  const {data}=useSuspenseQuery(trpc.agents.getMany.queryOptions());
return(
  <div
  className="flex-1 pb-4 px-4 mb:px-8 flex flex-col gap-y-4"
  >
    <AgentsListHeader/>
    <DataTable
    data={data}
    columns={columns}
    />
    {data.length===0 &&(
      <EmptyState
      title="create your first agent"
      description="create an agent to join your meetings.Each agent will follow your instructions and interact with participants during the call"
      />
    )}
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