import { config } from "./config"
import type { EnergyState, RoomId, RoomSummary } from "./types"

export async function fetchEnergyState(): Promise<EnergyState> {
  const response = await fetch(`${config.backendUrl}/api/state`, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as EnergyState
}

const roomAliases: Record<string, RoomId> = {
  drawing: "drawing-room",
  "drawing-room": "drawing-room",
  drawingroom: "drawing-room",
  work1: "work-room-1",
  "work-1": "work-room-1",
  workroom1: "work-room-1",
  "work-room-1": "work-room-1",
  work2: "work-room-2",
  "work-2": "work-room-2",
  workroom2: "work-room-2",
  "work-room-2": "work-room-2",
}

export function normalizeRoomName(input: string): RoomId | null {
  const key = input.trim().toLowerCase().replace(/\s+/g, "")
  return roomAliases[key] ?? null
}

export function findRoom(state: EnergyState, input: string): RoomSummary | null {
  const roomId = normalizeRoomName(input)

  if (!roomId) {
    return null
  }

  return state.rooms.find((room) => room.id === roomId) ?? null
}
