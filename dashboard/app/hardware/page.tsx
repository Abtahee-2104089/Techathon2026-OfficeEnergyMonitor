import {
  IconCircuitBulb,
  IconCircuitResistor,
  IconCircuitSwitchClosed,
  IconCpu2,
  IconExternalLink,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const devices = [
  {
    id: "drawing-room-fan-1",
    name: "Fan 1",
    type: "fan",
    output: "GPIO 16",
    sense: "GPIO 32",
    ratedWatts: 60,
    relay: "CH1",
    y: 118,
  },
  {
    id: "drawing-room-fan-2",
    name: "Fan 2",
    type: "fan",
    output: "GPIO 17",
    sense: "GPIO 33",
    ratedWatts: 60,
    relay: "CH2",
    y: 188,
  },
  {
    id: "drawing-room-light-1",
    name: "Light 1",
    type: "light",
    output: "GPIO 18",
    sense: "GPIO 25",
    ratedWatts: 15,
    relay: "CH3",
    y: 258,
  },
  {
    id: "drawing-room-light-2",
    name: "Light 2",
    type: "light",
    output: "GPIO 19",
    sense: "GPIO 26",
    ratedWatts: 15,
    relay: "CH4",
    y: 328,
  },
  {
    id: "drawing-room-light-3",
    name: "Light 3",
    type: "light",
    output: "GPIO 21",
    sense: "GPIO 27",
    ratedWatts: 15,
    relay: "CH5",
    y: 398,
  },
]

export default function HardwarePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">
            Hardware simulation
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            A clean in-app preview of the Wokwi representative circuit for one
            room: ESP32, five safe state inputs, and five low-voltage load
            indicators.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Wokwi concept</Badge>
          <Badge variant="outline">ESP32</Badge>
          <Badge variant="secondary">drawing-room</Badge>
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCircuitBulb data-icon="inline-start" />
              Relay and sensing preview
            </CardTitle>
            <CardDescription>
              The representative room circuit mirrors the simulator contract:
              device id, room, type, status, watts, ratedWatts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CircuitPreview />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Pin mapping</CardTitle>
              <CardDescription>
                Matches `wokwi/diagram.json` and `wokwi/sketch.ino`.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Relay</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Sense</TableHead>
                    <TableHead className="text-right">Watts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.name}>
                      <TableCell className="font-medium">
                        {device.name}
                      </TableCell>
                      <TableCell>{device.relay}</TableCell>
                      <TableCell>{device.output}</TableCell>
                      <TableCell>{device.sense}</TableCell>
                      <TableCell className="text-right">
                        {device.ratedWatts}W
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Repository files</CardTitle>
              <CardDescription>
                Use these for the hardware deliverable.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <FileLine path="wokwi/diagram.json" />
              <FileLine path="wokwi/sketch.ino" />
              <FileLine path="docs/hardware-schematic.md" />
              <FileLine path="docs/assets/one-room-hardware-schematic.svg" />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

function CircuitPreview() {
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/20">
      <svg
        role="img"
        aria-label="Wokwi-style ESP32 room circuit preview"
        viewBox="0 0 900 560"
        className="h-auto w-full"
      >
        <rect width="900" height="560" rx="18" fill="var(--background)" />
        <text
          x="28"
          y="44"
          className="fill-foreground text-lg font-semibold"
        >
          Drawing Room representative IoT circuit
        </text>
        <text x="28" y="72" className="fill-muted-foreground text-sm">
          2 fans + 3 lights · ESP32 inputs · relay channels · JSON state
        </text>

        <foreignObject x="35" y="145" width="190" height="250">
          <div className="flex h-full flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <IconCpu2 />
              </span>
              <div className="font-semibold">ESP32</div>
            </div>
            <div className="text-sm leading-6 text-muted-foreground">
              Reads safe switch feedback, drives relay channels, and emits the
              same state shape used by the dashboard and Discord bot.
            </div>
            <Badge variant="secondary" className="w-fit">
              drawing-room
            </Badge>
          </div>
        </foreignObject>

        <text x="285" y="115" className="fill-muted-foreground text-sm">
          Sense inputs
        </text>
        <text x="612" y="115" className="fill-muted-foreground text-sm">
          Relay channels
        </text>
        <text x="740" y="115" className="fill-muted-foreground text-sm">
          Loads
        </text>

        {devices.map((device, index) => (
          <g key={device.name}>
            <Wire
              d={`M225 ${device.y + 11} H275`}
              color="var(--chart-2)"
            />
            <Wire
              d={`M390 ${device.y + 11} H486`}
              color="var(--chart-1)"
            />
            <Wire
              d={`M574 ${device.y + 11} H614`}
              color="var(--chart-1)"
            />
            <Wire
              d={`M700 ${device.y + 11} H738`}
              color="var(--chart-5)"
            />
            <DeviceSwitch
              x={282}
              y={device.y - 15}
              label={device.name}
              pin={device.sense}
            />
            <Resistor x={489} y={device.y - 8} />
            <RelayChannel
              x={585}
              y={device.y - 18}
              channel={device.relay}
              pin={device.output}
            />
            <LoadDevice
              x={745}
              y={device.y - 18}
              label={`${device.name} ${device.ratedWatts}W`}
              type={device.type}
              id={device.id}
            />
            <text
              x="238"
              y={device.y + 6}
              className="fill-muted-foreground text-xs"
            >
              {index + 1}
            </text>
          </g>
        ))}

        <foreignObject x="292" y="452" width="420" height="70">
          <div className="rounded-lg border bg-card p-3 text-xs text-card-foreground shadow-sm">
            <div className="font-medium">Serial payload example</div>
            <code className="mt-1 block truncate text-muted-foreground">
              {"{\"id\":\"drawing-room-fan-1\",\"status\":\"on\",\"watts\":60,\"ratedWatts\":60}"}
            </code>
          </div>
        </foreignObject>

        <path
          d="M690 476 H250 V413"
          fill="none"
          stroke="var(--border)"
          strokeWidth="3"
        />
        <text x="705" y="482" className="fill-muted-foreground text-xs">
          common GND
        </text>
      </svg>
    </div>
  )
}

function Wire({ d, color }: { d: string; color: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth="3" />
}

function DeviceSwitch({
  x,
  y,
  label,
  pin,
}: {
  x: number
  y: number
  label: string
  pin: string
}) {
  return (
    <foreignObject x={x} y={y} width="118" height="54">
      <div className="flex h-full items-center gap-2 rounded-md border bg-card px-3 text-card-foreground shadow-sm">
        <IconCircuitSwitchClosed />
        <div className="min-w-0">
          <div className="truncate text-xs font-medium">{label}</div>
          <div className="truncate font-mono text-[10px] text-muted-foreground">
            {pin}
          </div>
        </div>
      </div>
    </foreignObject>
  )
}

function Resistor({ x, y }: { x: number; y: number }) {
  return (
    <foreignObject x={x} y={y} width="54" height="38">
      <div className="flex h-full items-center justify-center rounded-md border bg-muted text-muted-foreground shadow-sm">
        <IconCircuitResistor />
      </div>
    </foreignObject>
  )
}

function RelayChannel({
  x,
  y,
  channel,
  pin,
}: {
  x: number
  y: number
  channel: string
  pin: string
}) {
  return (
    <foreignObject x={x} y={y} width="125" height="60">
      <div className="flex h-full items-center gap-3 rounded-md border bg-card px-3 text-card-foreground shadow-sm">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          {channel}
        </span>
        <div className="min-w-0">
          <div className="truncate text-xs font-medium">Relay</div>
          <div className="truncate font-mono text-[10px] text-muted-foreground">
            {pin}
          </div>
        </div>
      </div>
    </foreignObject>
  )
}

function LoadDevice({
  x,
  y,
  label,
  type,
  id,
}: {
  x: number
  y: number
  label: string
  type: string
  id: string
}) {
  return (
    <foreignObject x={x} y={y} width="140" height="60">
      <div className="flex h-full items-center gap-3 rounded-md border bg-card px-3 text-card-foreground shadow-sm">
        <span className="flex size-8 items-center justify-center rounded-full border bg-background">
          <span
            className={
              type === "fan"
                ? "size-4 rounded-full bg-chart-2"
                : "size-4 rounded-full bg-chart-4"
            }
          />
        </span>
        <div className="min-w-0">
          <div className="truncate text-xs font-medium">{label}</div>
          <div className="truncate font-mono text-[10px] text-muted-foreground">
            {id}
          </div>
        </div>
      </div>
    </foreignObject>
  )
}

function FileLine({ path }: { path: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted p-3">
      <code className="truncate text-xs">{path}</code>
      <IconExternalLink className="text-muted-foreground" />
    </div>
  )
}
