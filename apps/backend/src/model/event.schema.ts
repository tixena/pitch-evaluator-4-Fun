import { z } from "zod";

export const eventStatusSchema = z.enum(["OPEN", "CLOSED"]);

export const eventSchema = z.object({
  id: z.string().min(1, "Id is required"),
  name: z
    .string()
    .min(3, "Name must have at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),
  description: z
    .string()
    .min(5, "Description must have at least 5 characters")
    .max(500, "Description cannot exceed 500 characters"),
  status: eventStatusSchema,
  createdAt: z.string(),
  organizerId: z.string().min(1, "Organizer id is required"),
});

export type Event = z.infer<typeof eventSchema>;
export type EventStatus = z.infer<typeof eventStatusSchema>;