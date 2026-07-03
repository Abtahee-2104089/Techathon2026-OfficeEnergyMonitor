export type RoomId = "drawing-room" | "work-room-1" | "work-room-2"
export type DeviceType = "fan" | "light"
export type DeviceStatus = "on" | "off"
export type AlertSeverity = "warning" | "critical"

export type Device = {
  id: string
  name: string
  type: DeviceType
  roomId: RoomId
  roomName: string
  status: DeviceStatus
  watts: number
  ratedWatts: number
  lastChanged: string
  onSince: string | null
  minutesInCurrentState: number
}

export type RoomSummary = {
  id: RoomId
  name: string
  devices: Device[]
  totalWatts: number
  activeDevices: number
  lightsOn: number
  fansOn: number
}

export type EnergyAlert = {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  timestamp: string
  roomId?: RoomId
}

export type EnergyState = {
  generatedAt: string
  simulatedClock: string
  isAfterHours: boolean
  totalWatts: number
  estimatedTodayKwh: number
  activeDevices: number
  deviceCount: number
  rooms: RoomSummary[]
  alerts: EnergyAlert[]
}

type DeviceDefinition = {
  id: string
  name: string
  type: DeviceType
  roomId: RoomId
  roomName: string
  ratedWatts: number
  phase: number
}

const DHAKA_TIME_ZONE = "Asia/Dhaka"
const DEVICE_TOGGLE_MS = 1500
const OFFICE_OPEN_HOUR = 9
const OFFICE_CLOSE_HOUR = 17

const rooms: Array<{ id: RoomId; name: string }> = [
  { id: "drawing-room", name: "Drawing Room" },
  { id: "work-room-1", name: "Work Room 1" },
  { id: "work-room-2", name: "Work Room 2" },
]

const definitions: DeviceDefinition[] = rooms.flatMap((room, roomIndex) => {
  const roomOffset = roomIndex * 7

  return [
    {
      id: `${room.id}-fan-1`,
      name: "Fan 1",
      type: "fan",
      roomId: room.id,
      roomName: room.name,
      ratedWatts: 60,
      phase: 2 + roomOffset,
    },
    {
      id: `${room.id}-fan-2`,
      name: "Fan 2",
      type: "fan",
      roomId: room.id,
      roomName: room.name,
      ratedWatts: 60,
      phase: 8 + roomOffset,
    },
    {
      id: `${room.id}-light-1`,
      name: "Light 1",
      type: "light",
      roomId: room.id,
      roomName: room.name,
      ratedWatts: 15,
      phase: 4 + roomOffset,
    },
    {
      id: `${room.id}-light-2`,
      name: "Light 2",
      type: "light",
      roomId: room.id,
      roomName: room.name,
      ratedWatts: 15,
      phase: 11 + roomOffset,
    },
    {
      id: `${room.id}-light-3`,
      name: "Light 3",
      type: "light",
      roomId: room.id,
      roomName: room.name,
      ratedWatts: 15,
      phase: 15 + roomOffset,
    },
  ]
})

function toggleTick(date: Date) {
  return Math.floor(date.getTime() / DEVICE_TOGGLE_MS)
}

function hashDeviceTick(device: DeviceDefinition, tick: number) {
  const seed = tick * 1103515245 + device.phase * 2654435761
  const mixed = Math.sin(seed) * 10000

  return mixed - Math.floor(mixed)
}

function isDeviceOn(device: DeviceDefinition, tick: number) {
  const randomValue = hashDeviceTick(device, tick)
  const threshold = device.type === "fan" ? 0.36 : 0.46

  return randomValue < threshold
}

function lastChangedAt(device: DeviceDefinition, now: Date, tick: number) {
  const currentState = isDeviceOn(device, tick)
  let ticksAgo = 0

  while (
    ticksAgo < 80 &&
    isDeviceOn(device, tick - ticksAgo) === currentState
  ) {
    ticksAgo += 1
  }

  return new Date(now.getTime() - ticksAgo * DEVICE_TOGGLE_MS)
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date)
}

function getDhakaHour(date: Date) {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_TIME_ZONE,
    hour: "numeric",
    hour12: false,
  }).format(date)

  return Number(hour)
}

function buildDevices(now: Date): Device[] {
  const tick = toggleTick(now)

  return definitions.map((definition) => {
    const isOn = isDeviceOn(definition, tick)
    const changedAt = lastChangedAt(definition, now, tick)

    return {
      id: definition.id,
      name: definition.name,
      type: definition.type,
      roomId: definition.roomId,
      roomName: definition.roomName,
      status: isOn ? "on" : "off",
      watts: isOn ? definition.ratedWatts : 0,
      ratedWatts: definition.ratedWatts,
      lastChanged: changedAt.toISOString(),
      onSince: isOn ? changedAt.toISOString() : null,
      minutesInCurrentState: Math.max(
        0,
        Math.floor((now.getTime() - changedAt.getTime()) / 60000)
      ),
    }
  })
}

function buildAlerts(
  roomsWithDevices: RoomSummary[],
  now: Date,
  isAfterHours: boolean,
  totalWatts: number
): EnergyAlert[] {
  const alerts: EnergyAlert[] = []
  const timestamp = now.toISOString()

  if (isAfterHours) {
    for (const room of roomsWithDevices) {
      if (room.activeDevices > 0) {
        alerts.push({
          id: `after-hours-${room.id}`,
          severity: room.activeDevices >= 4 ? "critical" : "warning",
          title: `${room.name} still active after hours`,
          message: `${room.activeDevices} device${room.activeDevices === 1 ? " is" : "s are"} still on and drawing ${room.totalWatts}W.`,
          timestamp,
          roomId: room.id,
        })
      }
    }
  }

  for (const room of roomsWithDevices) {
    const allDevicesOn = room.activeDevices === room.devices.length
    const longestRuntime = Math.max(
      ...room.devices.map((device) =>
        device.status === "on" ? device.minutesInCurrentState : 0
      )
    )

    if (allDevicesOn && longestRuntime >= 120) {
      alerts.push({
        id: `all-on-${room.id}`,
        severity: "critical",
        title: `${room.name} has every device running`,
        message: `All lights and fans have been active for at least ${longestRuntime} minutes.`,
        timestamp,
        roomId: room.id,
      })
    }
  }

  if (totalWatts >= 250) {
    alerts.push({
      id: "high-load",
      severity: "warning",
      title: "High office load",
      message: `The office is currently drawing ${totalWatts}W. Check whether this matches actual occupancy.`,
      timestamp,
    })
  }

  return alerts
}

export function getEnergyState(now = new Date()): EnergyState {
  const devices = buildDevices(now)
  const roomSummaries: RoomSummary[] = rooms.map((room) => {
    const roomDevices = devices.filter((device) => device.roomId === room.id)
    const totalWatts = roomDevices.reduce(
      (sum, device) => sum + device.watts,
      0
    )

    return {
      id: room.id,
      name: room.name,
      devices: roomDevices,
      totalWatts,
      activeDevices: roomDevices.filter((device) => device.status === "on")
        .length,
      lightsOn: roomDevices.filter(
        (device) => device.type === "light" && device.status === "on"
      ).length,
      fansOn: roomDevices.filter(
        (device) => device.type === "fan" && device.status === "on"
      ).length,
    }
  })

  const hour = getDhakaHour(now)
  const isAfterHours = hour < OFFICE_OPEN_HOUR || hour >= OFFICE_CLOSE_HOUR
  const totalWatts = roomSummaries.reduce(
    (sum, room) => sum + room.totalWatts,
    0
  )
  const activeDevices = roomSummaries.reduce(
    (sum, room) => sum + room.activeDevices,
    0
  )
  const estimatedTodayKwh = Number(
    (
      totalWatts *
      Math.max(1, hour + now.getMinutes() / 60) *
      0.001 *
      0.58
    ).toFixed(2)
  )

  return {
    generatedAt: now.toISOString(),
    simulatedClock: formatTime(now),
    isAfterHours,
    totalWatts,
    estimatedTodayKwh,
    activeDevices,
    deviceCount: devices.length,
    rooms: roomSummaries,
    alerts: buildAlerts(roomSummaries, now, isAfterHours, totalWatts),
  }
}
