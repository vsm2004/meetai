import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
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
});