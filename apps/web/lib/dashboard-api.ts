import { apiFetch, apiFetchBlob } from "./api";

export type DashboardEvent = {
  id: string;
  name: string;
  description: string;
  status: "OPEN" | "CLOSED";
  createdAt: string | null;
  organizerId: string;
};

export type DashboardPitch = {
  id: string;
  eventId: string;
  name: string;
  description: string;
  color: string;
  logoUrl: string | null;
  createdAt: string | null;
};

export type DashboardRankingItem = {
  id: string;
  eventId: string;
  name: string;
  description: string;
  color: string;
  logoUrl: string | null;
  votesCount: number;
  innovationAvg: number;
  viabilityAvg: number;
  impactAvg: number;
  presentationAvg: number;
  scoreAvg: number;
};

export type DashboardPitchDetail = {
  id: string;
  eventId: string;
  name: string;
  description: string;
  color: string;
  logoUrl: string | null;
  votesCount: number;
  innovationAvg: number;
  viabilityAvg: number;
  impactAvg: number;
  presentationAvg: number;
};

export type DashboardPitchComment = {
  id: string;
  comment: string;
  createdAt: string;
};

export type DashboardPitchQr = {
  id: string;
  name: string;
  publicVoteUrl: string;
};

export function getEvents() {
    return apiFetch<DashboardEvent[]>("/api/event");
}

export function getPitches(eventId: string) {
    return apiFetch<DashboardPitch[]>(`/api/pitch?eventId=${eventId}`)
};

export function getRanking(eventId: string) {
    return apiFetch<DashboardRankingItem[]>(`/api/vote/ranking?eventId=${eventId}`)
}

export function getPitchDetail(pitchId: string) {
    return apiFetch<DashboardPitchDetail>(`/api/pitch/detail/${pitchId}`)
}

export function getPitchComments(pitchId: string) {
    return apiFetch<DashboardPitchComment[]>(`/api/pitch/comments?pitchId=${pitchId}`)
}

export function getPitchQr(pitchId: string) {
    return apiFetch<DashboardPitchQr>(`/api/pitch/${pitchId}/qr`)
}

export function exportEvent(eventId: string) {
    return apiFetchBlob(`/api/event/${eventId}/export`)
}

export function exportPitch(pitchId: string) {
    return apiFetchBlob(`/api/pitch/${pitchId}/export`)
}
