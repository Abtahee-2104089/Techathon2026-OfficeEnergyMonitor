# Implementation Plan

## Objective

Build a fast, polished, real-time office energy monitoring system with:

- Shared backend.
- Dynamic simulated IoT device data.
- Animated live dashboard.
- Discord bot using the same backend.
- Clear diagrams and hardware schematic.
- Strong documentation and commit history.

## Assumptions

- The fixed office setup is authoritative: 3 rooms, each with 2 fans and 3 lights, for 15 total devices.
- No physical hardware is required.
- A representative one-room circuit schematic is enough.
- Office hours are 9:00 AM to 5:00 PM.
- The preliminary round is judged from the repository, documentation, code, and demo video.

## Scoring Strategy

The fastest path to a strong score is:

1. Make the shared backend reliable.
2. Make the dashboard visually memorable and obviously live.
3. Make the Discord bot prove it reads the same data.
4. Include clear diagrams and hardware reasoning.
5. Keep setup simple and documentation complete.

## Phase 1 - Foundation

Create the project structure:

```text
apps/api
apps/web
apps/bot
docs
```

Use TypeScript across all app packages if time allows. Keep the simulator simple and deterministic enough for demo testing.

## Phase 2 - Backend And Simulator

Implementation plan:

- Hardcode the office rooms and device definitions.
- Assign realistic wattage values:
  - Fan: 60W when on.
  - Light: 15W when on.
- Update random device states on a timer.
- Keep `lastChanged` and `onSince` timestamps.
- Calculate:
  - Current total watts.
  - Per-room watts.
  - Estimated kWh.
  - Alerts.
- Broadcast updates through Socket.IO.

Trade-offs:

- In-memory state is enough for a hackathon demo and keeps setup simple.
- A database would add persistence but increase deployment and setup risk.

Validation:

- Call `GET /api/state` and confirm all dashboard and bot values come from it.
- Watch Socket.IO events update the dashboard without refresh.

## Phase 3 - Dashboard

Implementation plan:

- Build an office layout as the first visual focus.
- Use CSS grid or absolute-positioned zones for three rooms.
- Show lights as glowing elements.
- Show fans with spin animation while on.
- Add live meters and alerts around the layout.
- Add a compact device panel for completeness.

Trade-offs:

- A hand-built CSS office layout is faster and more controllable than a complex canvas scene.
- CSS animations are reliable for demo and deployment.

Validation:

- Leave dashboard open and verify live changes.
- Test at common laptop widths.
- Confirm no text overlap and no broken responsive layout.

## Phase 4 - Discord Bot

Implementation plan:

- Use `discord.js`.
- Read state from backend endpoints.
- Format friendly command responses.
- Poll or subscribe for alerts, then post new alerts to a configured channel.

Trade-offs:

- Static friendly templates are safer than adding an LLM dependency under time pressure.
- If the core app is stable, add optional LLM-powered phrasing later.

Validation:

- Run `!status`, `!room drawing`, `!room work1`, `!room work2`, and `!usage`.
- Compare bot output against dashboard values.

## Phase 5 - Diagrams And Schematic

System diagram:

- Use Excalidraw, draw.io, Figma, or Canva.
- Show device simulator, backend API, WebSocket, dashboard, Discord bot, and user.
- Export PNG into `docs/assets/`.

Hardware schematic:

- Build a representative one-room design in Wokwi or Tinkercad.
- Use ESP32 or Arduino.
- Model 2 fans and 3 lights as representative controlled/sensed loads.
- Include safe conceptual use of relays or opto-isolated sensing.
- Optionally include a current sensor such as ACS712 conceptually.

Validation:

- Confirm the diagram tells the full device-to-user data flow.
- Confirm the schematic makes electrical sense and is documented with pin mapping.

## Phase 6 - Deployment And Demo

Deployment plan:

- Deploy frontend to Vercel.
- Deploy backend to Render or Railway.
- Run bot locally for demo if cloud bot deployment takes too long.

Demo video structure:

1. Problem in 10 seconds.
2. Dashboard live layout and power meter.
3. Alerts.
4. Discord bot commands.
5. Architecture diagram and shared backend explanation.
6. Schematic screenshot.

Validation:

- Demo from a fresh browser session.
- Confirm repository is public.
- Confirm README includes setup and submission links.
