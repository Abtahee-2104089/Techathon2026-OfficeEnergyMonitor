import type { EnergyAlert, EnergyState, RoomSummary } from "./types"

function plural(count: number, singular: string, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

function formatDeviceCounts(room: RoomSummary) {
  if (room.activeDevices === 0) {
    return `${room.name}: all off`
  }

  return `${room.name}: ${plural(room.fansOn, "fan")} ON, ${plural(room.lightsOn, "light")} ON`
}

export function formatStatus(state: EnergyState) {
  const roomLines = state.rooms.map(formatDeviceCounts).join(". ")
  const alertText =
    state.alerts.length > 0
      ? ` I also see ${plural(state.alerts.length, "active alert")}.`
      : " No active alerts right now."

  return `Here's the office snapshot: ${roomLines}. Total load is ${state.totalWatts}W.${alertText}`
}

export function formatRoom(room: RoomSummary) {
  const onDevices = room.devices.filter((device) => device.status === "on")

  if (onDevices.length === 0) {
    return `${room.name} is quiet: all lights and fans are off, so it is drawing 0W.`
  }

  const deviceList = onDevices
    .map((device) => `${device.name} (${device.watts}W)`)
    .join(", ")

  return `${room.name} is drawing ${room.totalWatts}W. Currently on: ${deviceList}.`
}

export function formatUsage(state: EnergyState) {
  const roomBreakdown = state.rooms
    .map((room) => `${room.name}: ${room.totalWatts}W`)
    .join(", ")

  return `Total power right now: ${state.totalWatts}W. Today's estimated usage: ${state.estimatedTodayKwh.toFixed(2)} kWh. Room breakdown: ${roomBreakdown}.`
}

export function formatHelp(prefix: string) {
  return [
    "I can check the office energy dashboard for you.",
    "",
    `\`${prefix}status\` - summary of every room`,
    `\`${prefix}room drawing\` - Drawing Room details`,
    `\`${prefix}room work1\` - Work Room 1 details`,
    `\`${prefix}room work2\` - Work Room 2 details`,
    `\`${prefix}usage\` - total watts and estimated kWh`,
  ].join("\n")
}

export function formatAlert(alert: EnergyAlert) {
  const severity = alert.severity === "critical" ? "Critical" : "Heads up"
  return `${severity}: ${alert.title}. ${alert.message}`
}
