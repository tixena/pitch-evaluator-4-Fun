"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getEvents,
  getPitches,
  getRanking,
  getPitchDetail,
  getPitchQr,
} from "@/lib/dashboard-api";

export function useEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: getEvents
    })
}

export function usePitches(eventId?: string) {
    return useQuery({
        queryKey: ["pitches", eventId],
        queryFn: () => getPitches(eventId!),
        enabled: Boolean(eventId),
    })
}

export function useRanking(eventId?: string) {
    return useQuery({
        queryKey: ["ranking", eventId],
        queryFn: () => getRanking(eventId!),
        enabled: Boolean(eventId),
        refetchInterval: 5000,
    })
}
export function usePitchDetail(pitchId?: string) {
    return useQuery({
        queryKey: ["pitch-detail", pitchId],
        queryFn: () => getPitchDetail(pitchId!),
        enabled: Boolean(pitchId)
    })
}

export function usePitchQr(pitchId?: string) {
    return useQuery({
        queryKey: ["pitch-qr", pitchId],
        queryFn: () => getPitchQr(pitchId!),
        enabled: Boolean(pitchId)
    })
}
