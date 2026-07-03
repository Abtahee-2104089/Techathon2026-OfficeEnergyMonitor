import {
  IconCircuitBulb,
  IconCircuitResistor,
  IconCircuitSwitchClosed,
  IconCpu2,
  IconExternalLink,
  IconInfoCircle,
} from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
    name: "Fan 1",
    type: "fan",
    output: "GPIO 16",
    sense: "GPIO 32",
    watts: "60W",
    y: 118,
  },
  {
    name: "Fan 2",
    type: "fan",
    output: "GPIO 17",
    sense: "GPIO 33",
    watts: "60W",
    y: 188,
  },
  {
    name: "Light 1",
    type: "light",
    output: "GPIO 18",
    sense: "GPIO 25",
    watts: "15W",
    y: 258,
  },
  {
    name: "Light 2",
    type: "light",
    output: "GPIO 19",
    sense: "GPIO 26",
    watts: "15W",
    y: 328,
  },
  {
    name: "Light 3",
    type: "light",
    output: "GPIO 21",
    sense: "GPIO 27",
    watts: "15W",
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
          <Badge variant="secondary">one room</Badge>
        </div>
      </header>

      <Alert>
        <IconInfoCircle />
        <AlertTitle>Why not render with avr8js?</AlertTitle>
        <AlertDescription>
          avr8js is the AVR CPU simulation core, not the Wokwi visual renderer.
          Our concept uses ESP32, so this page renders the representative Wokwi
          circuit directly as a readable dashboard preview while the real Wokwi
          files stay in the repository.
        </AlertDescription>
      </Alert>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCircuitBulb data-icon="inline-start" />
              Wokwi-style circuit preview
            </CardTitle>
            <CardDescription>
              Slide switches model safe device-state feedback; LEDs model
              low-voltage output indicators.
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
                      <TableCell>{device.output}</TableCell>
                      <TableCell>{device.sense}</TableCell>
                      <TableCell className="text-right">
                        {device.watts}
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
          2 fans + 3 lights · safe inputs · low-voltage indicators
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
              Reads five state inputs and mirrors them to output indicators.
            </div>
            <Badge variant="secondary" className="w-fit">
              JSON over serial
            </Badge>
          </div>
        </foreignObject>

        <text x="285" y="115" className="fill-muted-foreground text-sm">
          State inputs
        </text>
        <text x="610" y="115" className="fill-muted-foreground text-sm">
          Output indicators
        </text>

        {devices.map((device, index) => (
          <g key={device.name}>
            <Wire
              d={`M225 ${device.y + 11} H275`}
              color="var(--chart-2)"
            />
            <Wire
              d={`M390 ${device.y + 11} H502`}
              color="var(--chart-1)"
            />
            <Wire
              d={`M548 ${device.y + 11} H612`}
              color="var(--chart-1)"
            />
            <DeviceSwitch
              x={282}
              y={device.y - 15}
              label={device.name}
              pin={device.sense}
            />
            <Resistor x={505} y={device.y - 8} />
            <LoadLed
              x={625}
              y={device.y - 18}
              label={`${device.name} ${device.watts}`}
              type={device.type}
              pin={device.output}
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

function LoadLed({
  x,
  y,
  label,
  type,
  pin,
}: {
  x: number
  y: number
  label: string
  type: string
  pin: string
}) {
  return (
    <foreignObject x={x} y={y} width="170" height="60">
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
            {pin}
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
