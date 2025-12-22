import { db } from "@/db";
import z from "zod";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({input}) => {
        try {
            console.log('[agents.getMany] Starting query...');
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id,input.id))
            
            console.log('[agents.getMany] Query completed, waiting 5 seconds...');
            await new Promise((resolve) => setTimeout(resolve, 5000));
            
            console.log('[agents.getMany] Returning data:', existingAgent);
            return existingAgent;
        } catch (error) {
            console.error('[agents.getMany] Error:', error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error instanceof Error ? error.message : "Failed to fetch agents"
            });
        }
    }),
    getMany: protectedProcedure.query(async () => {
        try {
            console.log('[agents.getMany] Starting query...');
            const data = await db
                .select()
                .from(agents);
            
            console.log('[agents.getMany] Query completed, waiting 5 seconds...');
            await new Promise((resolve) => setTimeout(resolve, 5000));
            
            console.log('[agents.getMany] Returning data:', data);
            return data;
        } catch (error) {
            console.error('[agents.getMany] Error:', error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error instanceof Error ? error.message : "Failed to fetch agents"
            });
        }
    }),
    create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async({input,ctx})=>{
        const [createdAgent]= await db
        .insert(agents)
        .values({
            ...input,
            userid:ctx.auth.user.id,
        })
        .returning();
        return createdAgent;
    }),
});