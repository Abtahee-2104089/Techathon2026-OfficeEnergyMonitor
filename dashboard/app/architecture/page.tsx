import { IconExternalLink } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeading } from "@/components/page-heading"
import { cn } from "@/lib/utils"

type DiagramNode = {
  id: string
  title: string
  detail: string
  x: number
  y: number
  tone: "device" | "backend" | "ui" | "alert" | "data"
}

type DiagramEdge = {
  from: string
  to: string
  label?: string
}

const repoBase = "https://github.com/Seyamalam/Techathon2026-Huntrix/blob/main"

const toneClasses = {
  device: "fill-sky-50 stroke-sky-500 dark:fill-sky-950 dark:stroke-sky-400",
  backend:
    "fill-violet-50 stroke-violet-500 dark:fill-violet-950 dark:stroke-violet-400",
  ui: "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950 dark:stroke-emerald-400",
  alert:
    "fill-amber-50 stroke-amber-500 dark:fill-amber-950 dark:stroke-amber-400",
  data: "fill-slate-50 stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-500",
}

const systemNodes: DiagramNode[] = [
  {
    id: "office",
    title: "Office rooms",
    detail: "3 rooms, 15 lights/fans",
    x: 40,
    y: 120,
    tone: "device",
  },
  {
    id: "sim",
    title: "Simulated IoT layer",
    detail: "frequent state changes",
    x: 270,
    y: 120,
    tone: "device",
  },
  {
    id: "api",
    title: "Single backend API",
    detail: "GET /api/state",
    x: 500,
    y: 120,
    tone: "backend",
  },
  {
    id: "instant",
    title: "InstantDB snapshot",
    detail: "optional realtime cache",
    x: 500,
    y: 280,
    tone: "data",
  },
  {
    id: "web",
    title: "Web dashboard",
    detail: "floor plan, charts, alerts",
    x: 730,
    y: 60,
    tone: "ui",
  },
  {
    id: "bot",
    title: "Discord bot",
    detail: "commands + alert posts",
    x: 730,
    y: 210,
    tone: "ui",
  },
  {
    id: "ai",
    title: "OpenRouter",
    detail: "natural wording only",
    x: 730,
    y: 360,
    tone: "backend",
  },
]

const systemEdges: DiagramEdge[] = [
  { from: "office", to: "sim", label: "device state" },
  { from: "sim", to: "api", label: "EnergyState JSON" },
  { from: "api", to: "web", label: "poll 1.5s" },
  { from: "api", to: "bot", label: "same source" },
  { from: "api", to: "instant", label: "snapshot" },
  { from: "api", to: "ai", label: "facts" },
  { from: "ai", to: "bot", label: "humanized copy" },
]

const webNodes: DiagramNode[] = [
  {
    id: "pages",
    title: "Dashboard pages",
    detail: "/, devices, alerts, analytics",
    x: 60,
    y: 90,
    tone: "ui",
  },
  {
    id: "hook",
    title: "useEnergyState",
    detail: "polls live state",
    x: 300,
    y: 90,
    tone: "data",
  },
  {
    id: "api",
    title: "Next API route",
    detail: "fresh no-store response",
    x: 540,
    y: 90,
    tone: "backend",
  },
  {
    id: "rules",
    title: "Alert builder",
    detail: "9 to 5 + high load",
    x: 540,
    y: 260,
    tone: "alert",
  },
  {
    id: "render",
    title: "Live UI",
    detail: "SVG glow, fan spin, charts",
    x: 780,
    y: 90,
    tone: "ui",
  },
]

const webEdges: DiagramEdge[] = [
  { from: "pages", to: "hook" },
  { from: "hook", to: "api" },
  { from: "api", to: "rules" },
  { from: "api", to: "render" },
  { from: "rules", to: "render", label: "alerts" },
]

const botNodes: DiagramNode[] = [
  {
    id: "user",
    title: "Discord user",
    detail: "!status, !room, !usage",
    x: 60,
    y: 140,
    tone: "ui",
  },
  {
    id: "bot",
    title: "Huntrix bot",
    detail: "parses command",
    x: 300,
    y: 140,
    tone: "ui",
  },
  {
    id: "api",
    title: "Shared backend",
    detail: "live office facts",
    x: 540,
    y: 140,
    tone: "backend",
  },
  {
    id: "llm",
    title: "OpenRouter",
    detail: "varied Discord markdown",
    x: 540,
    y: 310,
    tone: "backend",
  },
  {
    id: "channel",
    title: "Alert channel",
    detail: "proactive posts",
    x: 780,
    y: 140,
    tone: "alert",
  },
]

const botEdges: DiagramEdge[] = [
  { from: "user", to: "bot", label: "message" },
  { from: "bot", to: "api", label: "fetch state" },
  { from: "api", to: "bot", label: "facts" },
  { from: "bot", to: "llm", label: "wording" },
  { from: "llm", to: "bot", label: "reply text" },
  { from: "api", to: "channel", label: "new alerts" },
]

const deploymentNodes: DiagramNode[] = [
  {
    id: "repo",
    title: "GitHub repo",
    detail: "Techathon2026-Huntrix",
    x: 50,
    y: 140,
    tone: "data",
  },
  {
    id: "docker",
    title: "Docker local stack",
    detail: "dashboard + optional InstantDB",
    x: 290,
    y: 60,
    tone: "backend",
  },
  {
    id: "vercel",
    title: "Vercel dashboard",
    detail: "root: dashboard/",
    x: 290,
    y: 220,
    tone: "ui",
  },
  {
    id: "bot",
    title: "Bot runtime",
    detail: "local/server process",
    x: 530,
    y: 140,
    tone: "ui",
  },
  {
    id: "services",
    title: "External services",
    detail: "Discord, OpenRouter, InstantDB",
    x: 770,
    y: 140,
    tone: "backend",
  },
]

const deploymentEdges: DiagramEdge[] = [
  { from: "repo", to: "docker", label: "one command" },
  { from: "repo", to: "vercel", label: "deploy" },
  { from: "repo", to: "bot", label: "run bot" },
  { from: "docker", to: "services" },
  { from: "vercel", to: "services" },
  { from: "bot", to: "services" },
]

export default function ArchitecturePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <PageHeading
        title="Architecture"
        description="Hand-authored SVG architecture views for the shared backend, simulated IoT layer, dashboard, Discord bot, AI response path, and deployment setup."
      >
        <Badge>SVG diagrams</Badge>
        <Badge variant="outline">single source of truth</Badge>
        <Badge variant="secondary">dashboard + bot</Badge>
      </PageHeading>

      <DiagramCard
        title="Whole System Diagram"
        description="Complete flow from office device state to backend, dashboard, Discord bot, alerts, and AI summaries."
        nodes={systemNodes}
        edges={systemEdges}
        sourceHref={`${repoBase}/docs/assets/system-architecture.svg`}
      />
      <DiagramCard
        title="Web Dashboard Diagram"
        description="Next.js routes, API routes, simulator, alert builder, InstantDB sync, and visual dashboard pages."
        nodes={webNodes}
        edges={webEdges}
        sourceHref={`${repoBase}/docs/assets/web-dashboard-architecture.svg`}
      />
      <DiagramCard
        title="Discord Bot And AI Diagram"
        description="Command lifecycle, shared state fetch, deterministic fallback, LLM humanization, and proactive alerts."
        nodes={botNodes}
        edges={botEdges}
        sourceHref={`${repoBase}/docs/assets/discord-ai-flow.svg`}
      />
      <DiagramCard
        title="Deployment Diagram"
        description="Docker local setup, Vercel dashboard deployment, bot runtime, and optional external services."
        nodes={deploymentNodes}
        edges={deploymentEdges}
        sourceHref={`${repoBase}/docs/assets/deployment-architecture.svg`}
      />
    </main>
  )
}

function DiagramCard({
  title,
  description,
  nodes,
  edges,
  sourceHref,
}: {
  title: string
  description: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  sourceHref: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <a
            href={sourceHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title} SVG in GitHub`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <IconExternalLink />
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FlowSvg nodes={nodes} edges={edges} />
      </CardContent>
    </Card>
  )
}

function FlowSvg({
  nodes,
  edges,
}: {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]))

  return (
    <div className="overflow-x-auto rounded-lg border bg-muted/20 p-3">
      <svg
        role="img"
        aria-label="Architecture flow diagram"
        viewBox="0 0 980 470"
        className="min-w-[920px]"
      >
        <defs>
          <marker
            id="arch-arrow"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0 0 L0 8 L11 4 z" className="fill-foreground" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = nodeMap.get(edge.from)
          const to = nodeMap.get(edge.to)

          if (!from || !to) {
            return null
          }

          const fromX = from.x + 170
          const fromY = from.y + 48
          const toX = to.x
          const toY = to.y + 48
          const midX = (fromX + toX) / 2
          const path =
            Math.abs(fromY - toY) < 20
              ? `M${fromX} ${fromY} L${toX - 12} ${toY}`
              : `M${fromX} ${fromY} C${midX} ${fromY}, ${midX} ${toY}, ${toX - 12} ${toY}`

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path
                d={path}
                className="fill-none stroke-foreground/60"
                strokeWidth="2.5"
                markerEnd="url(#arch-arrow)"
              />
              {edge.label ? (
                <text
                  x={midX}
                  y={(fromY + toY) / 2 - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px] font-medium"
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          )
        })}
        {nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width="170"
              height="96"
              rx="14"
              className={cn("stroke-2", toneClasses[node.tone])}
            />
            <text
              x={node.x + 18}
              y={node.y + 38}
              className="fill-foreground text-[15px] font-semibold"
            >
              {node.title}
            </text>
            <text
              x={node.x + 18}
              y={node.y + 64}
              className="fill-muted-foreground text-[12px] font-medium"
            >
              {node.detail}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
