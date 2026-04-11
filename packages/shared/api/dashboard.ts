import { z } from "zod";

export const dashboardEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["OPEN", "CLOSED"]),
  createdAt: z.string().nullable(),
  organizerId: z.string(),
});

export const dashboardPitchSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  logoUrl: z.string().nullable(),
  createdAt: z.string().nullable(),
});

export const dashboardRankingItemSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  logoUrl: z.string().nullable(),
  votesCount: z.number(),
  innovationAvg: z.number(),
  viabilityAvg: z.number(),
  impactAvg: z.number(),
  presentationAvg: z.number(),
  scoreAvg: z.number(),
});

export const dashboardPitchDetailSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  logoUrl: z.string().nullable(),
  votesCount: z.number(),
  innovationAvg: z.number(),
  viabilityAvg: z.number(),
  impactAvg: z.number(),
  presentationAvg: z.number(),
});

export const dashboardPitchCommentSchema = z.object({
  id: z.string(),
  comment: z.string(),
  createdAt: z.string(),
});

export const dashboardPitchQrSchema = z.object({
  id: z.string(),
  name: z.string(),
  publicVoteUrl: z.string().url(),
});

// Inferred types
export type DashboardEvent = z.infer<typeof dashboardEventSchema>;
export type DashboardPitch = z.infer<typeof dashboardPitchSchema>;
export type DashboardRankingItem = z.infer<typeof dashboardRankingItemSchema>;
export type DashboardPitchDetail = z.infer<typeof dashboardPitchDetailSchema>;
export type DashboardPitchComment = z.infer<typeof dashboardPitchCommentSchema>;
export type DashboardPitchQr = z.infer<typeof dashboardPitchQrSchema>;
