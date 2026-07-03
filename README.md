# Techathon 2026 - Office Energy Monitor

A planned real-time office energy monitoring system for the Techathon Nationals Hackathon preliminary round.

The project goal is to monitor office lights and fans through one shared backend, a live animated web dashboard, and a Discord bot. The system uses simulated IoT device data because no physical hardware is required for the preliminary round.

## Problem Understanding

The office runs daily coordination through Discord, but lights and fans are often left running after people leave. The required solution should let users:

- See every room's lights and fans on a live dashboard.
- Track current power usage across the office and per room.
- Receive alerts for suspicious or wasteful usage.
- Ask a Discord bot for status and usage without opening the dashboard.

The problem statement has one device-count conflict:

- It defines 3 rooms.
- Each room has 2 fans and 3 lights.
- That means 15 total devices.
- Later text mentions 18 devices.

This project follows the fixed room/device definition: 15 devices total.

## Required Features

- Shared backend as the single source of truth.
- Simulated dynamic device data.
- Real-time dashboard updates without page refresh.
- Live device status grouped by room.
- Live total and per-room power usage.
- Active alerts panel.
- Discord bot commands:
  - `!status`
  - `!room <name>`
  - `!usage`
- System architecture diagram.
- Representative hardware/electrical schematic for one room.
- Clear setup and run instructions.
- Short demo video.

## Target Architecture

```text
Simulated Device Layer
  -> Backend API + WebSocket Server
    -> Live Web Dashboard
    -> Discord Bot
```

Both the dashboard and Discord bot must read from the same backend state. The bot must not generate independent random data.

## Planned Tech Stack

- Frontend: React, TypeScript, Vite or Next.js
- Styling: Tailwind CSS
- Animation: Framer Motion and CSS animations
- Icons: lucide-react
- Backend: Node.js, Express
- Real-time transport: Socket.IO
- Discord bot: discord.js
- Data source: in-memory simulator with optional JSON snapshot
- Deployment: Vercel for frontend, Render/Railway for backend and bot
- Diagrams: Excalidraw, draw.io, Figma, or Canva

## Dashboard Experience

The dashboard should feel like an office control room:

- Top-view layout with Drawing Room, Work Room 1, and Work Room 2.
- Lights glow when on.
- Fans spin when running.
- Room-level power cards.
- Animated total watt meter.
- Alerts visible at a glance.
- Device list grouped by room.
- Responsive layout for laptop demo screens.

## Backend Data Model

Each simulated device should include:

```ts
type Device = {
  id: string;
  name: string;
  type: "fan" | "light";
  room: "drawing-room" | "work-room-1" | "work-room-2";
  status: "on" | "off";
  watts: number;
  lastChanged: string;
  onSince?: string;
};
```

The simulator should update device states over time and broadcast the full state through WebSocket events.

## Planned API

```text
GET /api/health
GET /api/state
GET /api/rooms
GET /api/rooms/:roomId
GET /api/usage
GET /api/alerts
```

Planned WebSocket event:

```text
state:update
```

## Alert Rules

- Device on after office hours, assuming office hours are 9:00 AM to 5:00 PM.
- All devices in one room on for more than 2 hours.
- Optional: unusually high total watt usage.

## Discord Bot Behavior

The bot should answer with concise, human-friendly messages from live backend data.

Example commands:

```text
!status
!room drawing
!room work1
!room work2
!usage
```

Bonus behavior: proactively post to a configured channel when a new alert appears.

## Repository Structure

```text
.
├── bot/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── dashboard/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── docs/
│   ├── architecture.md
│   ├── hardware-schematic.md
│   ├── plan.md
│   ├── team-contributions.md
│   └── todo.md
├── README.md
├── Rulebook.pdf
└── Problem Statement (Preliminary Round) v1.2.pdf
```

## Environment Variables

Planned variables:

```text
PORT=4000
CORS_ORIGIN=http://localhost:5173
DISCORD_TOKEN=
DISCORD_CHANNEL_ID=
BACKEND_URL=http://localhost:4000
```

## Local Development

Run the dashboard:

```bash
cd dashboard
bun install
bun run dev
```

Dashboard services:

- Web dashboard: `http://127.0.0.1:3000`
- Shared state API: `http://127.0.0.1:3000/api/state`

Run the Discord bot:

```bash
cd bot
cp .env.example .env
bun install
bun run start
```

Bot environment:

```text
DISCORD_TOKEN=your_bot_token
BACKEND_URL=http://127.0.0.1:3000
DISCORD_CHANNEL_ID=optional_alert_channel_id
```

Bot commands:

```text
!status
!room drawing
!room work1
!room work2
!usage
!help
```

## Team Contribution Plan

All four team members should contribute real artifacts:

- Developer: backend, dashboard, Discord bot, deployment.
- Documentation owner: README, setup guide, screenshots, submission checklist.
- Systems owner: architecture diagram and data-flow explanation.
- Hardware/demo owner: schematic explanation, demo script, testing checklist, video.

See [docs/team-contributions.md](docs/team-contributions.md) for details.

## Important Rulebook Notes

- Repository must be public.
- Repository should be created after the problem statement release.
- Code must be original and attributed where needed.
- AI coding assistants are allowed.
- README must explain setup, architecture, technologies, API endpoints, and AI integration details if used.
- Final submission includes GitHub link, demo video link, and team details.

## Current Status

The dashboard and Discord bot are implemented as separate packages. The dashboard exposes the shared live state API, and the bot reads from that same endpoint.
