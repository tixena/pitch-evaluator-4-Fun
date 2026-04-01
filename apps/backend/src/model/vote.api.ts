import { Router } from "express";
import { randomUUID } from "node:crypto";
import { db } from "../db.js";
import { voteSchema } from "./vote.schema.js";

export const voteRouter: Router = Router();

const DEMO_ORGANIZER_ID = "demo-organizer-id";

const createVoteSchema = voteSchema.omit({
  id: true,
  createdAt: true,
  ipAddress: true,
});

const getClientIpAddress = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  if (typeof value === "string" && value.length > 0) {
    return value.split(",")[0]?.trim() ?? null;
  }

  return null;
};

voteRouter.get("/", async (req, res) => {
  const pitchId = req.query.pitchId;

  if (typeof pitchId !== "string" || pitchId.length === 0) {
    return res.status(400).json({ message: "pitchId is required" });
  }

  try {
    const result = await db.query(
      `
        SELECT
          v.id,
          v."pitchId",
          v."evaluatorId",
          v."ipAddress",
          v.innovation,
          v.viability,
          v.impact,
          v.presentation,
          v.comment,
          v."createdAt"
        FROM vote v
        INNER JOIN pitch p ON p.id = v."pitchId"
        INNER JOIN event e ON e.id = p."eventId"
        WHERE v."pitchId" = $1
          AND e."organizerId" = $2
        ORDER BY v."createdAt" DESC
      `,
      [pitchId, DEMO_ORGANIZER_ID],
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch votes" });
  }
});

voteRouter.post("/", async (req, res) => {
  const parsed = createVoteSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid vote data",
      errors: parsed.error.flatten(),
    });
  }

  const {
    pitchId,
    evaluatorId,
    innovation,
    viability,
    impact,
    presentation,
    comment,
  } = parsed.data;

  try {
    const pitchResult = await db.query(
      `
        SELECT p.id
        FROM pitch p
        INNER JOIN event e ON e.id = p."eventId"
        WHERE p.id = $1
          AND e.status = 'OPEN'
      `,
      [pitchId],
    );

    if (pitchResult.rowCount === 0) {
      return res.status(404).json({
        message: "Pitch not found or voting is closed",
      });
    }

    const ipAddress =
      getClientIpAddress(req.headers["x-forwarded-for"]) ?? req.ip ?? null;

    const result = await db.query(
      `
        INSERT INTO vote (
          id,
          "pitchId",
          "evaluatorId",
          "ipAddress",
          innovation,
          viability,
          impact,
          presentation,
          comment,
          "createdAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING
          id,
          "pitchId",
          "evaluatorId",
          "ipAddress",
          innovation,
          viability,
          impact,
          presentation,
          comment,
          "createdAt"
      `,
      [
        randomUUID(),
        pitchId,
        evaluatorId ?? null,
        ipAddress,
        innovation,
        viability,
        impact,
        presentation,
        comment ?? null,
      ],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create vote" });
  }
});
