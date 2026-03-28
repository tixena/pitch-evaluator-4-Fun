import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { validateServerEnv } from "@workspace/shared/env/server";
import { auth } from "./auth.js";

const env = validateServerEnv();
const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(env.PORT, () => {
  console.log(`Backend server running on http://localhost:${env.PORT}`);
});
