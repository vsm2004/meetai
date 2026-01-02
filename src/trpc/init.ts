import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import type { Session, User } from 'better-auth';

interface Context {
  auth: {
    session: Session;
    user: User;
  } | null;
}

export const createTRPCContext = async (): Promise<Context> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return { auth: session };
  } catch (error) {
    return { auth: null };
  }
};

const t = initTRPC.context<Context>().create();
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.auth) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized"
    });
  }
  return next({
    ctx: { ...ctx, auth: ctx.auth }
  });
});
