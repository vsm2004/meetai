// src/trpc/routers/_app.ts
import { z } from 'zod';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  agents: agentsRouter,
});

export type AppRouter = typeof appRouter;
