import { db } from "@/db";
import z from "zod";
import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import { eq, getTableColumns, sql } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input,ctx }) => {
      try {
        const [existingAgent] = await db
          .select({
            ...getTableColumns(agents),
            
          })
          .from(agents)
          .where(eq(agents.id, input.id));

        return existingAgent;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch agent",
        });
      }
    }),

  getMany: protectedProcedure.query(async () => {
    try {
      const data = await db.select().from(agents);
      return data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch agents",
      });
    }
  }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userid: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),
});
