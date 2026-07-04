# 180-Second Demo Script

Target length: 3 minutes maximum.

## 0:00 - 0:20 Opening Problem

Show: dashboard home page at `http://localhost:3000`.

Say:
"This is Huntrix's office energy monitor for the Techathon problem. The office uses Discord for daily work, but people leave lights and fans running after hours. Our solution gives the boss one live dashboard and one Discord bot backed by the same simulated IoT state."

## 0:20 - 1:05 Live Dashboard

Show:

- Top metrics: current load, devices on, open alerts, office time.
- SVG floor plan.
- Wait a few seconds so lights/fans visibly change.
- Point at glowing lights and spinning fans.
- Hover a device to show the small info card.
- Click a device to open the detail drawer.

Say:
"The simulator changes device states frequently, so the dashboard stays visibly live without refresh. Each room has two fans and three lights. When a light is on it glows, and when a fan is on it spins. The hover card and drawer both read the same live backend state."

## 1:05 - 1:35 Power, Alerts, And Analytics

Show:

- Room power chart on the dashboard.
- Active alerts panel.
- `/analytics` route with usage charts.
- `/alerts` route if there are active alerts.

Say:
"The backend calculates total watts, per-room watts, today's estimated kWh, and active alerts. Alerts cover devices left on after the 9 to 5 office window, a room where everything has been on for too long, and unusually high load."

## 1:35 - 2:05 Discord Bot

Show: Discord server or local bot test output.

Run:

```text
!status
!room work1
!usage
!advice
```

Say:
"The Discord bot does not use random or hardcoded answers. Every command fetches the same `/api/state` endpoint used by the dashboard. If OpenRouter is configured, it turns the live facts into a more natural Discord message. If the LLM is unavailable, the deterministic fallback still works."

## 2:05 - 2:30 Architecture

Show:

- `/architecture`
- System architecture SVG.
- Discord flow SVG.

Say:
"The important design point is one source of truth. Simulated device data flows into the Next.js backend. The web dashboard, hardware preview, AI coach, and Discord bot all read that shared state contract."

## 2:30 - 2:50 Hardware Concept

Show:

- `/hardware`
- Wokwi relay/sensing preview.
- Pin mapping table.
- `wokwi/diagram.json` or `docs/assets/one-room-hardware-schematic.png`.

Say:
"For hardware, we model one representative room. An ESP32 reads five safe device-state inputs and drives five relay channels for two fans and three lights. LEDs stand in for loads in the simulation; real AC wiring would need certified relays, isolation, fuses, and electrical review."

## 2:50 - 3:00 Close

Show: dashboard home page again.

Say:
"This is a working real-time prototype: live dashboard, shared backend, Discord bot, AI-assisted responses, visual floor plan, alerts, and a sensible hardware concept ready to extend toward real IoT sensors."
