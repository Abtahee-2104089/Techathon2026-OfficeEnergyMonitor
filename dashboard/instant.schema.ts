import { i } from "@instantdb/react"

import type { EnergyState } from "./lib/energy-simulator"

const schema = i.schema({
  entities: {
    snapshots: i.entity({
      snapshotId: i.string().unique().indexed(),
      generatedAt: i.date().indexed(),
      simulatedClock: i.string(),
      payload: i.json<EnergyState>(),
    }),
    rooms: i.entity({
      roomId: i.string().unique().indexed(),
      name: i.string(),
      sortOrder: i.number().indexed(),
      totalWatts: i.number().indexed(),
      activeDevices: i.number().indexed(),
      lightsOn: i.number(),
      fansOn: i.number(),
    }),
    devices: i.entity({
      deviceId: i.string().unique().indexed(),
      name: i.string(),
      type: i.string<"fan" | "light">().indexed(),
      roomId: i.string().indexed(),
      roomName: i.string(),
      status: i.string<"on" | "off">().indexed(),
      watts: i.number().indexed(),
      ratedWatts: i.number(),
      lastChanged: i.date().indexed(),
      onSince: i.date().optional().indexed(),
      minutesInCurrentState: i.number(),
    }),
    readings: i.entity({
      readingId: i.string().unique().indexed(),
      sampledAt: i.date().indexed(),
      totalWatts: i.number().indexed(),
      activeDevices: i.number().indexed(),
      estimatedTodayKwh: i.number(),
      roomBreakdown: i.json<Record<string, number>>(),
    }),
    alerts: i.entity({
      alertId: i.string().unique().indexed(),
      severity: i.string<"warning" | "critical">().indexed(),
      title: i.string(),
      message: i.string(),
      timestamp: i.date().indexed(),
      roomId: i.string().optional().indexed(),
      active: i.boolean().indexed(),
    }),
  },
})

export default schema
export type AppSchema = typeof schema
