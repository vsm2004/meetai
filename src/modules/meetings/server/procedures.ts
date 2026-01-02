import { db } from "@/db"; 
import z from "zod";
import { meetings, agents } from "@/db/schema";
import { MeetingStatus } from "../types";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { 
  count, 
  desc, 
  ilike, 
  sql,
  and, 
  eq, 
  getTableColumns,
} from "drizzle-orm";

import { TRPCError } from "@trpc/server";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { meetingsInsertSchema } from "../schemas";

export const meetingsRouter = createTRPCRouter({
  update: protectedProcedure
  .input(
    meetingsInsertSchema.extend({
      id: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { id, ...values } = input;

    const [updatedMeeting] = await db
      .update(meetings)
      .set(values)
      .where(
        and(
          eq(meetings.id, id),
          eq(meetings.userid, ctx.auth.user.id)
        )
      )
      .returning();

    if (!updatedMeeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meeting not found",
      });
    }

    return updatedMeeting;
  }),

  create: protectedProcedure
      .input(meetingsInsertSchema)
      .mutation(async ({ input, ctx }) => {
        // Fetch the agent to get instructions
        const [updatedMeeting] = await db
          .select({ instructions: agents.instructions })
          .from(agents)
          .where(eq(agents.id, input.agentId))
          .limit(1);

        if (!updatedMeeting) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Meeting doesn't exist",
          });
        }

        const [createdMeeting] = await db
          .insert(meetings)
          .values({
            ...input,
            userid: ctx.auth.user.id,
            instructions: updatedMeeting.instructions,
          })
          .returning();
  
        return createdMeeting;
      }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),

        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userid, ctx.auth.user.id)
          )
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existingMeeting;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
        .enum([
          MeetingStatus.Upcoming,
          MeetingStatus.Completed,
          MeetingStatus.Active,
          MeetingStatus.Processing,
          MeetingStatus.Cancelled,
        ]).optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize,status,agentId } = input;

      try {
        const data = await db
          .select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
          })
          .from(meetings)
          .innerJoin(agents, eq(meetings.agentId, agents.id))
          .where(
            and(
              eq(meetings.userid, ctx.auth.user.id),
              search ? ilike(meetings.name, `%${search}%`) : undefined,
              status ? eq(meetings.status,status):undefined,
              agentId ? eq(meetings.agentId, agentId) : undefined
            )
          )
          .orderBy(desc(meetings.createdAt), desc(meetings.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize);

        const [total] = await db
          .select({ count: count() })
          .from(meetings)
          .innerJoin(agents, eq(meetings.agentId, agents.id))
          .where(
            and(
              eq(meetings.userid, ctx.auth.user.id),
              search ? ilike(meetings.name, `%${search}%`) : undefined,
              status ? eq(meetings.status,status):undefined,
              agentId ? eq(meetings.agentId, agentId) : undefined
            )
          );

        const totalPages = Math.ceil(total.count / pageSize);

        return { items: data, total: total.count, totalPages };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch meetings",
        });
      }
    }),

});
