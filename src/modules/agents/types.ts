import { inferRouterInputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";
export type AgentGetOne=inferRouterInputs<AppRouter>["agents"]["getOne"];