import { Pool } from "pg";
import { validateServerEnv } from "@workspace/shared/env/server";

const env = validateServerEnv();

export const db = new Pool({
    connectionString: env.DATABASE_URL,
})