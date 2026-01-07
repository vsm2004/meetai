import { db } from "@/db";
import z from "zod";
import { meetings, agents, user } from "@/db/schema";
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
import { streamVideo } from "@/lib/stream-video";
import { generatedAvatarUri } from "@/lib/avatar";
import { custom } from "better-auth";
import { Settings } from "lucide-react";

export const meetingsRouter = createTRPCRouter({

  // ✅ GENERATE STREAM TOKEN
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    const userName = ctx.auth.user.name;

    await streamVideo.upsertUsers([
      {
        id: userId,
        name: userName,
        role: "admin",
        image:
          ctx.auth.user.image ??
          generatedAvatarUri({
            seed: userName,
            variant: "initials",
          }),
      },
    ]);

    const issuedAt = Math.floor(Date.now() / 1000) - 60;
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;

    const token = streamVideo.generateUserToken({
      user_id: userId,
      iat: issuedAt,
      exp: expiresAt,
    });

    return { token };
  }),

  // ✅ DELETE
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removedMeeting] = await db
        .delete(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userid, ctx.auth.user.id)
          )
        )
        .returning();

      if (!removedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return removedMeeting;
    }),

  // ✅ UPDATE
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

  // ✅ CREATE
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [agent] = await db
        .select({ instructions: agents.instructions })
        .from(agents)
        .where(eq(agents.id, input.agentId))
        .limit(1);

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userid: ctx.auth.user.id,
          instructions: agent.instructions,
        })
        .returning();
      const call = streamVideo.video.call(
  "default",
  createdMeeting.id
);

await call.create({
  data: {
    created_by_id: ctx.auth.user.id,
    custom: {
      meetingId: createdMeeting.id,
      meetingName: createdMeeting.name,
    },
    settings_override: {
      transcription: {
        language: "en",
        mode: "auto-on",
        closed_caption_mode: "auto-on",
      },
      recording: {
        mode: "auto-on",
        quality: "1080p",
      },
    },
  },
});
  const[existingAgent]=await db
    .select()
    .from(agents)
    .where(eq(agents.id,createdMeeting.agentId))
  if(!existingAgent){
    throw new TRPCError({
      code:"NOT_FOUND",
      message:"Agent not found"
    })
  }
    await streamVideo.upsertUsers([
      {
        id:existingAgent.id,
        name:existingAgent.name,
        role:"user",
        image:generatedAvatarUri({
          seed:existingAgent.name,
          variant:"botttsNeutral"
        })
      }
    ])
      return createdMeeting;
    }),

  // ✅ GET ONE
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [meeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`
            EXTRACT(EPOCH FROM (ended_at - started_at))
          `.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userid, ctx.auth.user.id)
          )
        );

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return meeting;
    }),

  // ✅ GET MANY
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
          ])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause = and(
        eq(meetings.userid, ctx.auth.user.id),
        input.search
          ? ilike(meetings.name, `%${input.search}%`)
          : undefined,
        input.status
          ? eq(meetings.status, input.status)
          : undefined,
        input.agentId
          ? eq(meetings.agentId, input.agentId)
          : undefined
      );

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`
            EXTRACT(EPOCH FROM (ended_at - started_at))
          `.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(whereClause)
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(whereClause);

      return {
        items: data,
        total: total.count,
        totalPages: Math.ceil(total.count / input.pageSize),
      };
    }),
});
