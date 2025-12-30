import { inferRouterInputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";
export type MeetingGetOne=inferRouterInputs<AppRouter>["meetings"]["getOne"];