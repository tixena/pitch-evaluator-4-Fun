import { apiFetch, apiFetchBlob } from "./api/client";
import type {
  DashboardEvent,
  DashboardPitch,
  DashboardRankingItem,
  DashboardPitchDetail,
  DashboardPitchComment,
  DashboardPitchQr,
} from "@workspace/shared/api";

export type {
  DashboardEvent,
  DashboardPitch,
  DashboardRankingItem,
  DashboardPitchDetail,
  DashboardPitchComment,
  DashboardPitchQr,
};

export function getEvents() {
  return apiFetch<DashboardEvent[]>("/api/event");
}

export function getPitches(eventId: string) {
  return apiFetch<DashboardPitch[]>(`/api/pitch?eventId=${eventId}`);
}

export function getRanking(eventId: string) {
  return apiFetch<DashboardRankingItem[]>(
    `/api/vote/ranking?eventId=${eventId}`,
  );
}

export function getPitchDetail(pitchId: string) {
  return apiFetch<DashboardPitchDetail>(`/api/pitch/detail/${pitchId}`);
}

export function getPitchComments(pitchId: string) {
  return apiFetch<DashboardPitchComment[]>(
    `/api/pitch/comments?pitchId=${pitchId}`,
  );
}

export function getPitchQr(pitchId: string) {
  return apiFetch<DashboardPitchQr>(`/api/pitch/${pitchId}/qr`);
}

export function exportEvent(eventId: string) {
  return apiFetchBlob(`/api/event/${eventId}/export`);
}

export function exportPitch(pitchId: string) {
  return apiFetchBlob(`/api/pitch/${pitchId}/export`);
}
