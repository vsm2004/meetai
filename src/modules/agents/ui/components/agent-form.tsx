"use client";

import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { agentsInsertSchema } from "../../schemas";
import { AgentGetOne } from "../../types";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

/**
 * Explicitly tell TS what we *expect* here.
 * This avoids lying and keeps safety.
 */
type EditableAgentFields = {
  name?: string;
  instructions?: string;
};

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [["agents", "getMany"]] });
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Error creating agent:", error);
      },
    })
  );
  const updateAgent = useMutation(
  trpc.agents.update.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [["agents", "getMany"]] });
      onSuccess?.();
      if (initialValues?.id) {
  await queryClient.invalidateQueries(
    trpc.agents.getOne.queryOptions({ id: initialValues.id })
  );
}
    },
    onError: (error) => {
      console.error("Error updating agent:", error);
    },
  })
);

  const editable = initialValues as EditableAgentFields | undefined;

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: editable?.name ?? "",
      instructions: editable?.instructions ?? "",
    },
  });

  const isEdit = Boolean(initialValues);
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if(isEdit){
      updateAgent.mutate({ id: initialValues!.id, ...values });
    }
    else
      {createAgent.mutate(values);}
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        {/* Avatar */}
        <div className="col-span-2 flex justify-center">
          <GeneratedAvatar
            seed={form.watch("name")}
            variant="botttsNeutral"
            className="size-14 border"
          />
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Jules Winnfield" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instructions */}
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  className="resize-none"
                  placeholder="You are a maths tutor who helps with assessments…"
                />
              </FormControl>
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
  );
};
 