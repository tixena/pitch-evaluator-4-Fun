type EventStatus = "OPEN" | "CLOSED"

export type Event = {
    id: string,
    name: string,
    description: string,
    status: EventStatus,
    createdAt: Date,
    organizerId: string
}