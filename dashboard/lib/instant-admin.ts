import { init } from "@instantdb/admin"

import schema from "@/instant.schema"
import type { EnergyState } from "@/lib/energy-simulator"

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID ?? process.env.INSTANT_APP_ID
const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN

const db =
  appId && adminToken
    ? init({
        appId,
        adminToken,
        schema,
      })
    : null

let syncInFlight: Promise<void> | null = null
let lastSyncAt = 0

async function writeEnergyStateToInstant(state: EnergyState) {
  if (!db) {
    return
  }

  const generatedAt = new Date(state.generatedAt)
  const roomBreakdown = Object.fromEntries(
    state.rooms.map((room) => [room.id, room.totalWatts])
  )

  await db.transact([
    db.tx.snapshots.lookup("snapshotId", "current").update({
      generatedAt,
      simulatedClock: state.simulatedClock,
      payload: state,
    }),
    ...state.rooms.map((room, index) =>
      db.tx.rooms.lookup("roomId", room.id).update({
        name: room.name,
        sortOrder: index,
        totalWatts: room.totalWatts,
        activeDevices: room.activeDevices,
        lightsOn: room.lightsOn,
        fansOn: room.fansOn,
      })
    ),
    ...state.rooms.flatMap((room) =>
      room.devices.map((device) =>
        db.tx.devices.lookup("deviceId", device.id).update({
          name: device.name,
          type: device.type,
          roomId: device.roomId,
          roomName: device.roomName,
          status: device.status,
          watts: device.watts,
          ratedWatts: device.ratedWatts,
          lastChanged: new Date(device.lastChanged),
          onSince: device.onSince ? new Date(device.onSince) : null,
          minutesInCurrentState: device.minutesInCurrentState,
        })
      )
    ),
    db.tx.readings.lookup("readingId", state.generatedAt).update({
      sampledAt: generatedAt,
      totalWatts: state.totalWatts,
      activeDevices: state.activeDevices,
      estimatedTodayKwh: state.estimatedTodayKwh,
      roomBreakdown,
    }),
    ...state.alerts.map((alert) =>
      db.tx.alerts.lookup("alertId", alert.id).update({
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        timestamp: new Date(alert.timestamp),
        roomId: alert.roomId ?? null,
        active: true,
      })
    ),
  ])
}

export async function syncEnergyStateToInstant(state: EnergyState) {
  const now = Date.now()

  if (syncInFlight || now - lastSyncAt < 2000) {
    return
  }

  lastSyncAt = now
  syncInFlight = writeEnergyStateToInstant(state).finally(() => {
    syncInFlight = null
  })

  return syncInFlight
}
