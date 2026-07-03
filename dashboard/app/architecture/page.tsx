import type { ReactNode } from "react"
import {
  IconAlertTriangle,
  IconApi,
  IconBrain,
  IconBrandDiscord,
  IconBulb,
  IconChartAreaLine,
  IconClockHour5,
  IconCpu2,
  IconDatabase,
  IconDeviceDesktopAnalytics,
  IconPlugConnected,
  IconPropeller,
  IconRouter,
  IconServer,
  IconShieldCheck,
  IconWebhook,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeading } from "@/components/page-heading"

type NodeIcon = typeof IconServer

type DiagramNode = {
  id: string
  title: string
  subtitle: string
  icon: NodeIcon
  x: number
  y: number
  w?: number
  h?: number
  badge?: string
}

type Connector = {
  from: [number, number]
  to: [number, number]
  label?: string
  dashed?: boolean
}

export default function ArchitecturePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <PageHeading
        title="Architecture"
        description="Submission-ready diagrams for the shared backend, simulated IoT layer, live dashboard, Discord bot, alert rules, and AI response path."
      >
        <Badge>single source of truth</Badge>
        <Badge variant="outline">15 devices</Badge>
        <Badge variant="secondary">dashboard + bot</Badge>
      </PageHeading>

      <DiagramCard
        title="Whole System Data Flow"
        description="Every interface reads the same simulated device state. The dashboard, Discord bot, alert stream, and AI insight panel do not invent separate data."
      >
        <WholeSystemDiagram />
      </DiagramCard>

      <DiagramCard
        title="IoT And Hardware Side"
        description="Representative one-room hardware design for the Wokwi/ESP32 concept, mapped to the same IDs and wattage model used by the simulator."
      >
        <IoTSideDiagram />
      </DiagramCard>

      <DiagramCard
        title="Web Dashboard And Backend Side"
        description="The Next.js app exposes API routes, synchronizes to InstantDB when configured, and renders live UI panels from one typed state contract."
      >
        <WebSideDiagram />
      </DiagramCard>

      <DiagramCard
        title="Discord Bot, Alerts, And AI Side"
        description="The bot polls the same backend, answers commands from current state, and uses OpenRouter only to humanize summaries and recommendations."
      >
        <BotAiDiagram />
      </DiagramCard>
    </main>
  )
}

function DiagramCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function WholeSystemDiagram() {
  const nodes: DiagramNode[] = [
    {
      id: "office",
      title: "Office Devices",
      subtitle: "3 rooms · 6 fans · 9 lights · rated watts",
      icon: IconPlugConnected,
      x: 45,
      y: 128,
      badge: "physical model",
    },
    {
      id: "simulator",
      title: "Simulated Device Layer",
      subtitle: "status, watts, lastChanged, onSince",
      icon: IconRouter,
      x: 310,
      y: 128,
      badge: "dynamic data",
    },
    {
      id: "api",
      title: "Next.js Backend API",
      subtitle: "GET /api/state · alert rules · usage math",
      icon: IconServer,
      x: 575,
      y: 128,
      badge: "source of truth",
    },
    {
      id: "instant",
      title: "InstantDB Sync",
      subtitle: "optional realtime snapshot store",
      icon: IconDatabase,
      x: 575,
      y: 332,
      badge: "live cache",
    },
    {
      id: "web",
      title: "Web Dashboard",
      subtitle: "floor plan, devices, alerts, charts",
      icon: IconDeviceDesktopAnalytics,
      x: 845,
      y: 44,
      badge: "visual monitor",
    },
    {
      id: "bot",
      title: "Discord Bot",
      subtitle: "!status, !room, !usage, alerts",
      icon: IconBrandDiscord,
      x: 845,
      y: 212,
      badge: "chat access",
    },
    {
      id: "ai",
      title: "OpenRouter AI",
      subtitle: "friendly summaries and next actions",
      icon: IconBrain,
      x: 845,
      y: 380,
      badge: "optional LLM",
    },
  ]

  const connectors: Connector[] = [
    { from: [265, 202], to: [303, 202], label: "device state" },
    { from: [530, 202], to: [568, 202], label: "typed JSON" },
    { from: [705, 276], to: [705, 326], label: "snapshot" },
    { from: [800, 176], to: [838, 118], label: "poll/live query" },
    { from: [800, 213], to: [838, 286], label: "bot fetch" },
    { from: [800, 230], to: [838, 454], label: "context", dashed: true },
    { from: [980, 380], to: [980, 346], label: "human text", dashed: true },
  ]

  return (
    <DiagramFrame label="Full data path from device state to web and Discord">
      <DiagramSvg viewBox="0 0 1120 540" markerId="whole-arrow">
        <Swimlane x={28} y={26} w={250} h={488} title="Office Layer" />
        <Swimlane x={292} y={26} w={250} h={488} title="Simulation Layer" />
        <Swimlane x={558} y={26} w={250} h={488} title="Backend Layer" />
        <Swimlane x={824} y={26} w={268} h={488} title="User Interfaces" />
        {connectors.map((connector) => (
          <FlowConnector
            key={`${connector.from.join("-")}-${connector.to.join("-")}`}
            markerId="whole-arrow"
            {...connector}
          />
        ))}
        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}
        <DiagramNote x={46} y={426} w={216}>
          Wokwi represents one room; the software simulator expands the same
          contract to all three rooms.
        </DiagramNote>
        <DiagramNote x={588} y={446} w={190}>
          API and InstantDB carry the same current-state payload.
        </DiagramNote>
      </DiagramSvg>
    </DiagramFrame>
  )
}

function IoTSideDiagram() {
  const loads = [
    { label: "Fan 1", icon: IconPropeller, relay: "CH1", sense: "GPIO32" },
    { label: "Fan 2", icon: IconPropeller, relay: "CH2", sense: "GPIO33" },
    { label: "Light 1", icon: IconBulb, relay: "CH3", sense: "GPIO25" },
    { label: "Light 2", icon: IconBulb, relay: "CH4", sense: "GPIO26" },
    { label: "Light 3", icon: IconBulb, relay: "CH5", sense: "GPIO27" },
  ]

  return (
    <DiagramFrame label="Representative room wiring and telemetry path">
      <DiagramSvg viewBox="0 0 1120 590" markerId="iot-arrow">
        <Swimlane x={28} y={28} w={240} h={520} title="Safe Inputs" />
        <Swimlane x={292} y={28} w={240} h={520} title="Controller" />
        <Swimlane x={558} y={28} w={240} h={520} title="Relay Outputs" />
        <Swimlane x={824} y={28} w={268} h={520} title="Room Loads" />

        <Node
          id="switches"
          title="Wall Switch Feedback"
          subtitle="low-voltage or opto-isolated sensing inputs"
          icon={IconShieldCheck}
          x={54}
          y={112}
          w={190}
          h={116}
          badge="safe side"
        />
        <Node
          id="esp"
          title="ESP32 / Wokwi Sketch"
          subtitle="reads inputs, mirrors relays, prints JSON every 2.5s"
          icon={IconCpu2}
          x={322}
          y={106}
          w={180}
          h={132}
          badge="drawing-room"
        />
        <Node
          id="serial"
          title="Serial JSON Payload"
          subtitle='{"status":"on","watts":60,"ratedWatts":60}'
          icon={IconApi}
          x={322}
          y={356}
          w={180}
          h={126}
          badge="same contract"
        />
        <Node
          id="relay"
          title="5V Relay Board"
          subtitle="five channels isolate control side from load side"
          icon={IconPlugConnected}
          x={588}
          y={112}
          w={180}
          h={116}
          badge="CH1-CH5"
        />
        <Node
          id="current"
          title="Current Sensor"
          subtitle="optional aggregate validation for measured draw"
          icon={IconChartAreaLine}
          x={588}
          y={356}
          w={180}
          h={116}
          badge="ACS712 concept"
        />

        <FlowConnector
          from={[244, 170]}
          to={[315, 170]}
          markerId="iot-arrow"
          label="GPIO sense"
        />
        <FlowConnector
          from={[502, 170]}
          to={[581, 170]}
          markerId="iot-arrow"
          label="GPIO outputs"
        />
        <FlowConnector
          from={[676, 230]}
          to={[676, 348]}
          markerId="iot-arrow"
          label="load draw"
        />
        <FlowConnector
          from={[412, 238]}
          to={[412, 348]}
          markerId="iot-arrow"
          label="state object"
        />

        {loads.map((load, index) => {
          const y = 92 + index * 86
          const Icon = load.icon

          return (
            <g key={load.label}>
              <FlowConnector
                from={[768, y + 35]}
                to={[838, y + 35]}
                markerId="iot-arrow"
                label={load.relay}
              />
              <foreignObject x={850} y={y} width="210" height="70">
                <div className="flex h-full items-center gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                  <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{load.label}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {load.sense} sense · relay {load.relay}
                    </div>
                  </div>
                </div>
              </foreignObject>
            </g>
          )
        })}

        <DiagramNote x={64} y={404} w={160}>
          Real AC wiring requires certified relays/contactors, fuses, isolation,
          and electrical review.
        </DiagramNote>
        <DiagramNote x={322} y={500} w={712}>
          The Wokwi file safely substitutes slide switches and LEDs while
          preserving the same device IDs, pins, and wattage used by the app.
        </DiagramNote>
      </DiagramSvg>
    </DiagramFrame>
  )
}

function WebSideDiagram() {
  const nodes: DiagramNode[] = [
    {
      id: "api",
      title: "API Route",
      subtitle: "/api/state builds fresh EnergyState",
      icon: IconServer,
      x: 70,
      y: 126,
      badge: "server",
    },
    {
      id: "sim",
      title: "Energy Simulator",
      subtitle: "15 definitions, cycles, watts, timestamps",
      icon: IconClockHour5,
      x: 372,
      y: 60,
      badge: "deterministic",
    },
    {
      id: "rules",
      title: "Alert Rules",
      subtitle: "after-hours, high load, all-on runtime",
      icon: IconAlertTriangle,
      x: 372,
      y: 226,
      badge: "anomaly logic",
    },
    {
      id: "instant",
      title: "InstantDB Snapshot",
      subtitle: "rooms, devices, alerts, current snapshot",
      icon: IconDatabase,
      x: 674,
      y: 142,
      badge: "realtime",
    },
    {
      id: "ui",
      title: "Dashboard UI",
      subtitle: "floor plan, status table, charts, details",
      icon: IconDeviceDesktopAnalytics,
      x: 902,
      y: 142,
      badge: "operator view",
      w: 180,
    },
  ]

  return (
    <DiagramFrame label="Next.js backend and dashboard render path">
      <DiagramSvg viewBox="0 0 1120 500" markerId="web-arrow">
        <Swimlane x={38} y={34} w={250} h={410} title="HTTP Boundary" />
        <Swimlane x={326} y={34} w={292} h={410} title="State Builder" />
        <Swimlane x={652} y={34} w={218} h={410} title="Realtime Store" />
        <Swimlane x={902} y={34} w={180} h={410} title="Browser" />
        <FlowConnector
          from={[282, 200]}
          to={[365, 128]}
          markerId="web-arrow"
          label="generate"
        />
        <FlowConnector
          from={[282, 214]}
          to={[365, 294]}
          markerId="web-arrow"
          label="evaluate"
        />
        <FlowConnector
          from={[522, 126]}
          to={[667, 194]}
          markerId="web-arrow"
          label="rooms/devices"
        />
        <FlowConnector
          from={[522, 292]}
          to={[667, 216]}
          markerId="web-arrow"
          label="alerts"
        />
        <FlowConnector
          from={[850, 216]}
          to={[895, 216]}
          markerId="web-arrow"
          label="live query"
        />
        <FlowConnector
          from={[185, 256]}
          to={[895, 312]}
          markerId="web-arrow"
          label="fallback poll"
          dashed
        />
        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}
        <MetricStrip />
      </DiagramSvg>
    </DiagramFrame>
  )
}

function BotAiDiagram() {
  const nodes: DiagramNode[] = [
    {
      id: "discord",
      title: "Discord User",
      subtitle: "!status · !room work1 · !usage",
      icon: IconBrandDiscord,
      x: 58,
      y: 126,
      badge: "command",
    },
    {
      id: "bot",
      title: "Bot Runtime",
      subtitle: "parses commands, schedules alert checks",
      icon: IconWebhook,
      x: 326,
      y: 126,
      badge: "Node process",
    },
    {
      id: "state",
      title: "Shared Backend API",
      subtitle: "same /api/state as dashboard",
      icon: IconServer,
      x: 594,
      y: 126,
      badge: "truth",
    },
    {
      id: "formatter",
      title: "Command Formatter",
      subtitle: "friendly room and usage response",
      icon: IconApi,
      x: 594,
      y: 322,
      badge: "deterministic",
    },
    {
      id: "ai",
      title: "OpenRouter Free Model",
      subtitle: "humanizes summaries when key is configured",
      icon: IconBrain,
      x: 852,
      y: 126,
      badge: "optional",
    },
    {
      id: "alerts",
      title: "Proactive Alerts",
      subtitle: "posts when after-hours conditions trigger",
      icon: IconAlertTriangle,
      x: 852,
      y: 322,
      badge: "channel",
    },
  ]

  return (
    <DiagramFrame label="Discord command and proactive alert workflow">
      <DiagramSvg viewBox="0 0 1120 520" markerId="bot-arrow">
        <Swimlane x={36} y={34} w={236} h={430} title="Discord" />
        <Swimlane x={304} y={34} w={236} h={430} title="Bot Process" />
        <Swimlane x={572} y={34} w={236} h={430} title="Shared Data" />
        <Swimlane x={832} y={34} w={236} h={430} title="Responses" />

        <FlowConnector
          from={[265, 200]}
          to={[319, 200]}
          markerId="bot-arrow"
          label="message"
        />
        <FlowConnector
          from={[533, 200]}
          to={[587, 200]}
          markerId="bot-arrow"
          label="fetch state"
        />
        <FlowConnector
          from={[704, 256]}
          to={[704, 315]}
          markerId="bot-arrow"
          label="format"
        />
        <FlowConnector
          from={[783, 200]}
          to={[845, 200]}
          markerId="bot-arrow"
          label="context"
          dashed
        />
        <FlowConnector
          from={[783, 395]}
          to={[845, 395]}
          markerId="bot-arrow"
          label="alert event"
        />
        <FlowConnector
          from={[932, 322]}
          to={[932, 256]}
          markerId="bot-arrow"
          label="post"
        />
        <FlowConnector
          from={[596, 385]}
          to={[272, 385]}
          markerId="bot-arrow"
          label="reply text"
        />

        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}

        <DiagramNote x={72} y={358} w={172}>
          Bot responses are grounded in current simulated state, not hardcoded
          random messages.
        </DiagramNote>
        <DiagramNote x={868} y={72} w={168}>
          AI is optional; deterministic formatters remain the fallback path.
        </DiagramNote>
      </DiagramSvg>
    </DiagramFrame>
  )
}

function DiagramFrame({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/20">
      <div className="border-b bg-card px-4 py-3 text-sm font-medium">
        {label}
      </div>
      {children}
    </div>
  )
}

function DiagramSvg({
  viewBox,
  markerId,
  children,
}: {
  viewBox: string
  markerId: string
  children: ReactNode
}) {
  return (
    <svg
      role="img"
      aria-label="Architecture diagram"
      viewBox={viewBox}
      className="h-auto w-full"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="var(--foreground)" />
        </marker>
      </defs>
      <rect width="100%" height="100%" fill="var(--background)" />
      {children}
    </svg>
  )
}

function Swimlane({
  x,
  y,
  w,
  h,
  title,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="16"
        fill="var(--muted)"
        opacity="0.28"
        stroke="var(--border)"
      />
      <text
        x={x + 16}
        y={y + 28}
        className="fill-muted-foreground text-xs font-semibold uppercase"
      >
        {title}
      </text>
    </g>
  )
}

function Node({
  title,
  subtitle,
  icon: Icon,
  x,
  y,
  w = 220,
  h = 118,
  badge,
}: DiagramNode) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div className="flex h-full flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Icon />
          </span>
          <div className="min-w-0 font-semibold">{title}</div>
        </div>
        <div className="text-sm leading-5 text-muted-foreground">
          {subtitle}
        </div>
        {badge ? (
          <Badge variant="secondary" className="w-fit">
            {badge}
          </Badge>
        ) : null}
      </div>
    </foreignObject>
  )
}

function FlowConnector({
  from,
  to,
  label,
  dashed = false,
  markerId,
}: Connector & { markerId: string }) {
  const [x1, y1] = from
  const [x2, y2] = to
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const path =
    x1 === x2 || y1 === y2
      ? `M${x1} ${y1} L${x2} ${y2}`
      : `M${x1} ${y1} C${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="3"
        strokeDasharray={dashed ? "8 8" : undefined}
        markerEnd={`url(#${markerId})`}
        opacity={dashed ? 0.64 : 0.9}
      />
      {label ? (
        <g transform={`translate(${midX - 54} ${midY - 14})`}>
          <rect
            width="108"
            height="26"
            rx="13"
            fill="var(--background)"
            stroke="var(--border)"
          />
          <text
            x="54"
            y="17"
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] font-medium"
          >
            {label}
          </text>
        </g>
      ) : null}
    </g>
  )
}

function DiagramNote({
  x,
  y,
  w,
  children,
}: {
  x: number
  y: number
  w: number
  children: ReactNode
}) {
  return (
    <foreignObject x={x} y={y} width={w} height="72">
      <div className="h-full rounded-lg border bg-card p-3 text-xs leading-5 text-muted-foreground shadow-sm">
        {children}
      </div>
    </foreignObject>
  )
}

function MetricStrip() {
  const items = [
    ["rooms", "3"],
    ["devices", "15"],
    ["fan watts", "60W"],
    ["light watts", "15W"],
    ["refresh", "2.5s"],
  ]

  return (
    <foreignObject x="88" y="358" width="960" height="56">
      <div className="grid h-full grid-cols-5 overflow-hidden rounded-lg border bg-card shadow-sm">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col justify-center border-r px-4 last:border-r-0"
          >
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-lg font-semibold">{value}</div>
          </div>
        ))}
      </div>
    </foreignObject>
  )
}
