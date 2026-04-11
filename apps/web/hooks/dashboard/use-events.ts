"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardEvent } from "@workspace/shared/api";
import { getEvents } from "@/lib/dashboard-api";

export function useEvents() {
    return useQuery<DashboardEvent[]>({
        queryKey: ["events"],
        queryFn: getEvents,
    });
}
