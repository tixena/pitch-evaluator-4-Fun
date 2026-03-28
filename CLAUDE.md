# Project Guidelines

## Commands

Use `just` commands instead of running pnpm directly:

```bash
just install      # Install dependencies
just check        # Run lint, typecheck, build
just lint         # Run linter
just typecheck    # Run type checking
just build        # Build the project
just format       # Format code

just dev-web      # Run checks then start web dev server
just dev-backend  # Run checks then start backend dev server
just dev-all      # Run checks then start both
just dev-quick    # Start dev without checks

just db-up        # Start database and pgAdmin
just db-down      # Stop database
just db-logs      # View database logs
just db-reset     # Reset database (removes all data)
just db-migrate   # Run better-auth migrations
```

Run `just` to see all available commands.

## Environment Variables

All environment variables must be defined and validated in `packages/shared/env/`:

- **Server-side**: Add new env vars to `packages/shared/env/server.ts`
- **Client-side**: Add new env vars to `packages/shared/env/client.ts` (must be prefixed with `NEXT_PUBLIC_`)

Usage:
```typescript
// Backend
import { validateServerEnv } from "@workspace/shared/env/server";
const env = validateServerEnv();

// Frontend
import { validateClientEnv } from "@workspace/shared/env/client";
```

Never access `process.env` directly in application code.

## API Types

All API request/response schemas must be defined in `packages/shared/api/`:

- Create Zod schemas for validation
- Export inferred TypeScript types
- Use schemas for runtime validation in backend
- Use types for type safety in frontend

Example:
```typescript
// packages/shared/api/example.ts
import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateItemRequest = z.infer<typeof createItemSchema>;
```

## Frontend (Next.js)

### Avoid useEffect

Prefer these alternatives over `useEffect`:

- **Data fetching**: Use Server Components, `use()` hook, or React Query/SWR
- **Derived state**: Compute during render instead of syncing with useEffect
- **Event handlers**: Handle side effects in event handlers, not useEffect
- **Form state**: Use `useActionState` or form libraries like react-hook-form

Only use `useEffect` when truly necessary (e.g., subscriptions, manual DOM manipulation, third-party library integration).
