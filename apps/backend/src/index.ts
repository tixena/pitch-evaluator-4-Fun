import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { validateServerEnv } from "@workspace/shared/env/server";
import { auth } from "./auth.js";
import { eventRouter } from "./model/event.api.js";
import { pitchRouter } from "./model/pitch.api.js";

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

app.use("/api/event", eventRouter);
app.use("/api/pitch", pitchRouter);

app.listen(env.PORT, () => {
  console.log(`Backend server running on http://localhost:${env.PORT}`);
});
