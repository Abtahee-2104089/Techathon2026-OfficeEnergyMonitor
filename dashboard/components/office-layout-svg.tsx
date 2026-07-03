"use client"

import type { CSSProperties } from "react"

import type { Device, RoomId, RoomSummary } from "@/lib/energy-simulator"
import { cn } from "@/lib/utils"

type DevicePoint = {
  id: string
  label: string
  x: number
  y: number
}

type RoomBlueprint = {
  id: RoomId
  label: string
  centerX: number
  lights: DevicePoint[]
  fans: DevicePoint[]
}

const rooms: RoomBlueprint[] = [
  {
    id: "drawing-room",
    label: "Drawing Room",
    centerX: 160,
    lights: [
      { id: "drawing-room-light-1", label: "Light 1", x: 80, y: 90 },
      { id: "drawing-room-light-2", label: "Light 2", x: 240, y: 90 },
      { id: "drawing-room-light-3", label: "Light 3", x: 160, y: 330 },
    ],
    fans: [
      { id: "drawing-room-fan-1", label: "Fan 1", x: 160, y: 130 },
      { id: "drawing-room-fan-2", label: "Fan 2", x: 160, y: 250 },
    ],
  },
  {
    id: "work-room-1",
    label: "Work Room 1",
    centerX: 445,
    lights: [
      { id: "work-room-1-light-1", label: "Light 1", x: 350, y: 90 },
      { id: "work-room-1-light-2", label: "Light 2", x: 540, y: 90 },
      { id: "work-room-1-light-3", label: "Light 3", x: 445, y: 330 },
    ],
    fans: [
      { id: "work-room-1-fan-1", label: "Fan 1", x: 445, y: 130 },
      { id: "work-room-1-fan-2", label: "Fan 2", x: 445, y: 250 },
    ],
  },
  {
    id: "work-room-2",
    label: "Work Room 2",
    centerX: 735,
    lights: [
      { id: "work-room-2-light-1", label: "Light 1", x: 640, y: 90 },
      { id: "work-room-2-light-2", label: "Light 2", x: 830, y: 90 },
      { id: "work-room-2-light-3", label: "Light 3", x: 735, y: 330 },
    ],
    fans: [
      { id: "work-room-2-fan-1", label: "Fan 1", x: 735, y: 130 },
      { id: "work-room-2-fan-2", label: "Fan 2", x: 735, y: 250 },
    ],
  },
]

function getDevice(allRooms: RoomSummary[], id: string) {
  return allRooms
    .flatMap((room) => room.devices)
    .find((device) => device.id === id)
}

function getFanDuration(device?: Device) {
  if (!device || device.status === "off") {
    return "0.9s"
  }

  const runtimeBoost = Math.min(device.minutesInCurrentState / 180, 0.35)
  const loadBoost = Math.min(device.watts / 180, 0.3)

  return `${Number((0.95 - runtimeBoost - loadBoost).toFixed(2))}s`
}

export function OfficeLayoutSvg({ rooms: liveRooms }: { rooms: RoomSummary[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-[#090d16]">
      <svg
        role="img"
        aria-label="Live office IoT blueprint map"
        viewBox="0 0 900 480"
        className="h-auto w-full"
      >
        <defs>
          <radialGradient id="office-beam-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#eab308" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="900" height="480" fill="#090d16" />
        <BlueprintGrid />
        <Architecture />

        {rooms.map((room) => (
          <RoomLayer
            key={room.id}
            blueprint={room}
            liveRoom={liveRooms.find((item) => item.id === room.id)}
            liveRooms={liveRooms}
          />
        ))}
      </svg>
    </div>
  )
}

function BlueprintGrid() {
  return (
    <g stroke="#111827" strokeWidth="1">
      <path d="M0,60 H900 M0,120 H900 M0,180 H900 M0,240 H900 M0,300 H900 M0,360 H900 M0,420 H900" />
      <path d="M100,0 V480 M200,0 V480 M300,0 V480 M400,0 V480 M500,0 V480 M600,0 V480 M700,0 V480 M800,0 V480" />
    </g>
  )
}

function Architecture() {
  return (
    <>
      <g stroke="#374151" strokeLinecap="round" strokeWidth="4" fill="none">
        <path d="M 20 400 L 20 20 L 880 20 L 880 400 L 750 400 M 650 400 L 480 400 M 380 400 L 210 400 M 110 400 L 20 400" />
        <path d="M 300 20 L 300 400" />
        <path d="M 590 20 L 590 400" />
      </g>
      <g stroke="#1f2937" strokeWidth="1.5" fill="none" opacity="0.9">
        <path d="M112 400 A88 88 0 0 1 200 312" />
        <path d="M382 400 A84 84 0 0 1 466 316" />
        <path d="M652 400 A84 84 0 0 1 736 316" />
        <path d="M480 400 A76 76 0 0 1 556 324" />
      </g>
      <g fill="#111827" stroke="#1f2937">
        <rect x="40" y="120" width="30" height="140" rx="4" />
        <rect x="338" y="160" width="72" height="44" rx="4" />
        <rect x="482" y="160" width="72" height="44" rx="4" />
        <rect x="628" y="160" width="72" height="44" rx="4" />
        <rect x="772" y="160" width="72" height="44" rx="4" />
      </g>
    </>
  )
}

function RoomLayer({
  blueprint,
  liveRoom,
  liveRooms,
}: {
  blueprint: RoomBlueprint
  liveRoom?: RoomSummary
  liveRooms: RoomSummary[]
}) {
  return (
    <g>
      <text
        x={blueprint.centerX}
        y="50"
        fill="#6b7280"
        fontSize="12"
        fontWeight="700"
        letterSpacing="2"
        textAnchor="middle"
      >
        {blueprint.label.toUpperCase()}
      </text>
      <text
        x={blueprint.centerX}
        y="72"
        fill="#9ca3af"
        fontSize="12"
        fontWeight="600"
        textAnchor="middle"
      >
        {liveRoom?.activeDevices ?? 0} active / {liveRoom?.totalWatts ?? 0}W
      </text>

      {blueprint.lights.map((light) => (
        <LightNode
          key={light.id}
          point={light}
          device={getDevice(liveRooms, light.id)}
        />
      ))}
      {blueprint.fans.map((fan) => (
        <FanNode
          key={fan.id}
          point={fan}
          device={getDevice(liveRooms, fan.id)}
        />
      ))}
    </g>
  )
}

function LightNode({ point, device }: { point: DevicePoint; device?: Device }) {
  const active = device?.status === "on"

  return (
    <g
      className={cn("office-device-group", active && "active-light")}
      aria-label={`${point.label}: ${device?.status ?? "unknown"}`}
    >
      <circle
        cx={point.x}
        cy={point.y}
        r="55"
        fill="url(#office-beam-glow)"
        className="office-light-glow-cone"
      />
      <circle
        cx={point.x}
        cy={point.y}
        r="10"
        className="office-hardware-bulb"
      />
      <title>
        {point.label}: {device?.status ?? "unknown"}
      </title>
    </g>
  )
}

function FanNode({ point, device }: { point: DevicePoint; device?: Device }) {
  const active = device?.status === "on"
  const style = {
    animationDuration: getFanDuration(device),
  } satisfies CSSProperties

  return (
    <g
      className={cn("office-device-group", active && "active-fan")}
      transform={`translate(${point.x}, ${point.y})`}
      aria-label={`${point.label}: ${device?.status ?? "unknown"}`}
    >
      <g
        className="office-fan-blade-group"
        stroke={active ? "#22d3ee" : "#4b5563"}
        strokeLinecap="round"
        strokeWidth="5"
        style={style}
      >
        <line x1="0" y1="0" x2="0" y2="-26" />
        <line x1="0" y1="0" x2="22" y2="13" />
        <line x1="0" y1="0" x2="-22" y2="13" />
      </g>
      <circle cx="0" cy="0" r="6" fill="#020617" stroke="#9ca3af" />
      <title>
        {point.label}: {device?.status ?? "unknown"}
        {active ? `, ${getFanDuration(device)} rotation` : ""}
      </title>
    </g>
  )
}
