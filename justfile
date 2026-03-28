# Default recipe shows available commands
default:
	@just --list

# Install all dependencies
install:
	pnpm install

# Run all checks (lint, typecheck, build)
check: lint typecheck build

# Run linter
lint:
	pnpm lint

# Run type checking
typecheck:
	pnpm typecheck

# Build the project
build:
	pnpm build

# Run all checks then start web dev server
dev-web: check
	pnpm --filter web dev

dev-backend: check
	pnpm --filter backend dev

# Start web dev server without checks (quick start)
dev-quick:
	pnpm dev

# Run all checks then start both backend and web
dev-all: check
	pnpm --filter backend --filter web dev

# Format code
format:
	pnpm format

# Start database and pgAdmin
db-up:
	docker compose up -d

# Stop database and pgAdmin
db-down:
	docker compose down

# View database logs
db-logs:
	docker compose logs -f db

# Reset database (removes all data)
db-reset:
	docker compose down -v && docker compose up -d

# Start backend dev server
backend:
	pnpm --filter backend dev

# Build backend
backend-build:
	pnpm --filter backend build

# Run better-auth database migrations
db-migrate:
	cd apps/backend && pnpm dotenv -e ../../.env -- pnpm dlx @better-auth/cli migrate
