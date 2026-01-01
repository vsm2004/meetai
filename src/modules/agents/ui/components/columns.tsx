"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { CornerRightDownIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetMany>[] = [
  {
    accessorKey: "name",
    header: "Agent name",
    cell: ({ row }) => {
      const agent = row.original;

      return (
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={agent.name}
              className="size-6"
            />
            <span className="font-semibold capitalize">
              {agent.name}
            </span>
          </div>

          {agent.instructions && (
            <div className="flex items-center gap-x-2">
              <CornerRightDownIcon className="size-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                {agent.instructions}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "meetings",
    header: "Meetings",
    cell: ({ row }) => {
      const agent = row.original;

      const count = agent.meetingCount ?? 0;

      return (
        <Badge
          variant="outline"
          className="flex items-center gap-x-2 [&>svg]:size-4"
        >
          <VideoIcon className="text-blue-700" />
          {count} {count === 1 ? "meeting" : "meetings"}
        </Badge>
      );
    },
  },
];
