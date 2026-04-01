import { Router } from "express";
import { randomUUID } from "node:crypto";
import { db } from "../db.js";
import { createPitchSchema, updatePitchSchema } from "./pitch.schema.js";

export const pitchRouter: Router = Router();

// temporal
const DEMO_ORGANIZER_ID = "demo-organizer-id";

pitchRouter.get("/", async (req, res) => {
  const eventId = req.query.eventId;

  if (typeof eventId !== "string" || eventId.length === 0) {
    return res.status(400).json({ message: "eventId is required" });
  }

  try {
    const result = await db.query(
      `
        SELECT p.id, p."eventId", p.name, p.description, p.color, p."logoUrl", p."createdAt"
        FROM pitch p
        INNER JOIN event e ON e.id = p."eventId"
        WHERE p."eventId" = $1 AND e."organizerId" = $2
        ORDER BY p."createdAt" DESC
      `,
      [eventId, DEMO_ORGANIZER_ID],
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch pitches" });
  }
});

pitchRouter.post("/", async (req, res) => {
  const parsed = createPitchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid pitch data",
      errors: parsed.error.flatten(),
    });
  }
  //extrae datos del body
  const { eventId, name, description, color, logoUrl } = parsed.data;

  try {
    //comprueba que el evento existe y pertenece al organizador
    const eventResult = await db.query(
      `
        SELECT id
        FROM event
        WHERE id = $1 AND "organizerId" = $2
      `,
      [eventId, DEMO_ORGANIZER_ID],
    );

    if (eventResult.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const result = await db.query(
      `
        INSERT INTO pitch (id, "eventId", name, description, color, "logoUrl", "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id, "eventId", name, description, color, "logoUrl", "createdAt"
      `,
      [randomUUID(), eventId, name, description, color, logoUrl ?? null],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create pitch" });
  }
});

pitchRouter.patch("/:id", async (req, res) => {
  const parsed = updatePitchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid pitch data",
      errors: parsed.error.flatten(),
    });
  }

  const { name, description, color, logoUrl } = parsed.data;

  try {
    const result = await db.query(
      `
        UPDATE pitch p
        SET
          name = $1,
          description = $2,
          color = $3,
          "logoUrl" = $4
        FROM event e
        WHERE p.id = $5
          AND e.id = p."eventId"
          AND e."organizerId" = $6
        RETURNING p.id, p."eventId", p.name, p.description, p.color, p."logoUrl", p."createdAt"
      `,
      [name, description, color, logoUrl ?? null, req.params.id, DEMO_ORGANIZER_ID],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Pitch not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update pitch" });
  }
});

pitchRouter.delete("/:id", async (req, res) => {
  try {
    const result = await db.query(
      `
        DELETE FROM pitch p
        USING event e
        WHERE p.id = $1
          AND e.id = p."eventId"
          AND e."organizerId" = $2
      `,
      [req.params.id, DEMO_ORGANIZER_ID],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Pitch not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete pitch" });
  }
});
