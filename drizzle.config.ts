import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js uses .env.local; load the same file for drizzle-kit CLI commands.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
