"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return <div
  className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4"
  >
    {data.items.length === 0 ? (
      <EmptyState
        title="create your first meeting"
        description="Create an agent to join your meeting. each agent will follow your  instructions and interact with participants during the call."
      />
    ) : (
      <DataTable
        data={data.items}
        columns={columns}
      />
    )}
  </div>;
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="loading meetings"
      description="this may take a few seconds"
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="error in loading meetings"
      description="please try again later"
    />
  );
};
