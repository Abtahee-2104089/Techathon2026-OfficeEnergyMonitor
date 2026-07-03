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
