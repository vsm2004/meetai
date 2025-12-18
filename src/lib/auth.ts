import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  // -------------------------------
  // Authentication providers
  // -------------------------------
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // -------------------------------
  // Email / Password auth
  // -------------------------------
  emailAndPassword: {
    enabled: true,
  },

  // -------------------------------
  // Database adapter (Drizzle + PG)
  // -------------------------------
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),

  // -------------------------------
  // Redirect behavior (IMPORTANT)
  // -------------------------------
  callbacks: {
    async redirect() {
      // Always land on root after login
      return "/";
    },
  },
});
