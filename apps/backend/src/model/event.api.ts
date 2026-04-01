import { Router } from "express";
import { randomUUID } from "node:crypto";
import { db } from "../db.js";
import {
  createEventSchema,
  updateEventStatusSchema,
} from "./event.schema.js";
// import { relative } from "node:path";

export const eventRouter: Router = Router();

// Temporal mientras conectas auth 
const DEMO_ORGANIZER_ID = "demo-organizer-id";

// const session = await getCurrentSessionFromRequest(req);
// if (!session) {
//     return res.status(401).json({ message: "Unauthorized" });
// }

// const organizerId = session.user.id;

eventRouter.get("/", async (_req, res) => {
  try {
    const result = await db.query(
      `
        SELECT id, name, description, status, "createdAt", "organizerId"
        FROM event
        WHERE "organizerId" = $1
        ORDER BY "createdAt" DESC
      `,
      [DEMO_ORGANIZER_ID],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

eventRouter.post("/", async (req, res) => {
  const parsed = createEventSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid event data",
      errors: parsed.error.flatten(),
    });
  }

  const { name, description } = parsed.data;

  try {
    const result = await db.query(
      `
        INSERT INTO event (id, name, description, status, "createdAt", "organizerId")
        VALUES ($1, $2, $3, $4, NOW(), $5)
        RETURNING id, name, description, status, "createdAt", "organizerId"
      `,
      [randomUUID(), name, description, "OPEN", DEMO_ORGANIZER_ID],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create event" });
  }
});

eventRouter.patch("/:id/status", async (req, res) => {
  const parsed = updateEventStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid status",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const result = await db.query(
      `
        UPDATE event
        SET status = $1
        WHERE id = $2 AND "organizerId" = $3
        RETURNING id, name, description, status, "createdAt", "organizerId"
      `,
      [parsed.data.status, req.params.id, DEMO_ORGANIZER_ID],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update event status" });
  }
});

eventRouter.delete("/:id", async (req, res) => {
  try {
    const result = await db.query(
      `
        DELETE FROM event
        WHERE id = $1 AND "organizerId" = $2
      `,
      [req.params.id, DEMO_ORGANIZER_ID],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});
