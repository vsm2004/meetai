"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";
import { useRouter } from "next/navigation";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();

  // 🔑 normalize filters for tRPC
  const queryInput = {
    page: filters.page,
    search: filters.search || undefined,
    agentId: filters.agentId || undefined,
    status: filters.status ?? undefined, // 👈 IMPORTANT FIX
  };

  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions(queryInput)
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {data.items.length === 0 ? (
        <EmptyState
          title="Create your first meeting"
          description="Create an agent to join your meeting. Each agent will follow your instructions and interact with participants during the call."
        />
      ) : (
        <>
          <DataTable data={data.items} columns={columns} onRowClick={(row)=>router.push(`/meetings/${row.id}`)} />
          <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page)=>setFilters({page})}
          />
        </>
      )}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading meetings"
      description="This may take a few seconds"
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error loading meetings"
      description="Please try again later"
    />
  );
};
