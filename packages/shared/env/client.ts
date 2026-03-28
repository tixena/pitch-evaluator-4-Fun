import { z } from "zod";

const clientEnvSchema = z.object({
  // API endpoint
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("NEXT_PUBLIC_API_URL must be a valid URL"),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validates client environment variables.
 * Throws an error if validation fails (does not exit process on client).
 */
export function validateClientEnv(): ClientEnv {
  // In Next.js, we need to explicitly reference each NEXT_PUBLIC_ var
  // as tree-shaking removes unreferenced env vars
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!result.success) {
    console.error("\n❌ Invalid client environment variables:\n");
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".") || "unknown";
      console.error(`  • ${path}: ${issue.message}`);
    });
    console.error("\n");
    throw new Error("Invalid client environment variables");
  }

  return result.data;
}

/**
 * Creates a lazy-loaded client env object.
 * Call validateClientEnv() during app initialization to validate early.
 */
export function createClientEnv(): ClientEnv {
  return validateClientEnv();
}
