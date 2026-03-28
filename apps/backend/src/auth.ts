import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { validateServerEnv } from "@workspace/shared/env/server";

const env = validateServerEnv();

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
