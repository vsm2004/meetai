"use client";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommandSelect } from "@/components/command-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { meetingsInsertSchema } from "../../schemas";
import { MeetingGetOne } from "../../types";
import { useState } from "react";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

type EditableMeetingFields = {
  name?: string;
  agentId?: string;
};

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const[openNewAgentDialog,setopenNewAgentDialog]=useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  /* ---------------------- agents list ---------------------- */
  const agentsQuery = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  /* ---------------------- mutations ---------------------- */
  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        onSuccess?.(data.id);
      },
      onError: (error) => {
        console.error("Error creating meeting:", error);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
          );
        }
        onSuccess?.(data.id);
      },
      onError: (error) => {
        console.error("Error updating meeting:", error);
      },
    })
  );

  /* ---------------------- form ---------------------- */
  const editable = initialValues as EditableMeetingFields | undefined;

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: editable?.name ?? "",
      agentId: editable?.agentId ?? "",
    },
  });

  const isEdit = Boolean(initialValues);
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({
        ...values,
        id: initialValues!.id,
      });
    } else {
      createMeeting.mutate(values);
    }
  };

  /* ---------------------- UI ---------------------- */
  return (
    <>
    <NewAgentDialog
    open={openNewAgentDialog}
    onOpenChange={setopenNewAgentDialog}
    />
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Meeting name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Math tutoring session" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Agent select */}
        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Agent</FormLabel>
              <FormControl>
                {CommandSelect({
                  options: (agentsQuery.data?.items ?? []).map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    label: agent.name,
                    children: (
                      <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                          seed={agent.name}
                          variant="botttsNeutral"
                          className="size-6 border"
                        />
                        <span>{agent.name}</span>
                      </div>
                    ),
                  })),
                  value: field.value ?? "",
                  onSelect: (value) => {
                    field.onChange(value);
                  },
                  onSearch: setAgentSearch,
                  placeholder: "Select an agent",
                  className: "w-full",
                  title: "",
                  description: "",
                })}
              </FormControl>
              <FormDescription>
                Not found what you&apos;re looking for?{""}
                <button
                type="button"
                className="text-primary hover:underline"
                onClick={()=>setopenNewAgentDialog(true)}
                >
                  Create A new Agent
                </button>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
    </>
  );
};
