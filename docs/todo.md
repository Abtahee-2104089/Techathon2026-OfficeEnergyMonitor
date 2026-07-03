# Todo

## Immediate

- [ ] Confirm final team name for GitHub repository naming.
- [ ] Create public GitHub repository in the required format: `Techathon2026-[TeamName]`.
- [ ] Add all four team members as repository collaborators.
- [ ] Create GitHub Issues for documentation, diagrams, hardware schematic, testing, demo video, backend, dashboard, and bot.

## Backend

- [x] Initialize TypeScript backend through the Next.js dashboard app.
- [x] Define rooms and 15 simulated devices.
- [x] Build simulator that changes device states over time.
- [x] Calculate total watts and room-level watts.
- [x] Estimate daily kWh from simulated runtime.
- [x] Implement alert rules.
- [x] Add REST API endpoint for shared state.
- [ ] Add Socket.IO real-time updates.
- [ ] Add CORS configuration for dashboard.

## Web Dashboard

- [x] Initialize Next.js/React/TypeScript frontend.
- [x] Connect to backend API.
- [ ] Connect to Socket.IO updates.
- [x] Build top-view office layout.
- [x] Animate lights when on.
- [x] Animate fans when on.
- [x] Add live total power meter.
- [x] Add per-room power breakdown.
- [x] Add device status panel grouped by room.
- [x] Add active alerts panel.
- [ ] Make dashboard responsive for demo laptop screens.
- [ ] Polish loading, empty, and disconnected states.

## Discord Bot

- [x] Initialize Discord bot package.
- [x] Read backend URL from environment variable.
- [x] Implement `!status`.
- [x] Implement `!room <name>`.
- [x] Implement `!usage`.
- [x] Humanize responses.
- [x] Add proactive alert posting to configured channel.
- [x] Document bot setup and permissions.

## Diagrams And Hardware

- [ ] Create high-level system diagram without Mermaid.
- [ ] Export diagram image to `docs/assets/`.
- [ ] Create representative one-room circuit schematic in Wokwi or Tinkercad.
- [ ] Export screenshot to `docs/assets/`.
- [ ] Add pin mapping and electrical reasoning to docs.

## Documentation

- [ ] Update README after implementation.
- [ ] Add final setup instructions.
- [ ] Add API endpoint documentation.
- [ ] Add Discord command examples.
- [ ] Add deployment links.
- [ ] Add screenshots.
- [ ] Add demo video link.
- [ ] Add final team contribution breakdown.
- [ ] Add attribution for libraries, APIs, assets, and AI assistance.

## Validation

- [ ] Confirm dashboard updates without refresh.
- [ ] Confirm Discord bot and dashboard show the same backend state.
- [ ] Test alert conditions.
- [ ] Test setup from a fresh clone.
- [ ] Record a clean 3-minute demo video.
- [ ] Review repository commit history and README before submission.

## Submission

- [ ] Confirm repository is public.
- [ ] Confirm latest code is pushed.
- [ ] Confirm demo video is accessible.
- [ ] Submit GitHub link, demo video link, and team details through the official portal before the deadline.
