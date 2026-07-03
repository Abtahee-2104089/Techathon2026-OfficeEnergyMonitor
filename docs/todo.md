# Todo

## Immediate

- [ ] Confirm final team name for GitHub repository naming.
- [ ] Create public GitHub repository in the required format: `Techathon2026-[TeamName]`.
- [ ] Add all four team members as repository collaborators.
- [ ] Create GitHub Issues for documentation, diagrams, hardware schematic, testing, demo video, backend, dashboard, and bot.

## Backend

- [ ] Initialize Node.js/TypeScript backend.
- [ ] Define rooms and 15 simulated devices.
- [ ] Build simulator that changes device states over time.
- [ ] Calculate total watts and room-level watts.
- [ ] Estimate daily kWh from simulated runtime.
- [ ] Implement alert rules.
- [ ] Add REST API endpoints.
- [ ] Add Socket.IO real-time updates.
- [ ] Add CORS configuration for dashboard.

## Web Dashboard

- [ ] Initialize React/TypeScript frontend.
- [ ] Connect to backend API.
- [ ] Connect to Socket.IO updates.
- [ ] Build top-view office layout.
- [ ] Animate lights when on.
- [ ] Animate fans when on.
- [ ] Add live total power meter.
- [ ] Add per-room power breakdown.
- [ ] Add device status panel grouped by room.
- [ ] Add active alerts panel.
- [ ] Make dashboard responsive for demo laptop screens.
- [ ] Polish loading, empty, and disconnected states.

## Discord Bot

- [ ] Initialize Discord bot package.
- [ ] Read backend URL from environment variable.
- [ ] Implement `!status`.
- [ ] Implement `!room <name>`.
- [ ] Implement `!usage`.
- [ ] Humanize responses.
- [ ] Add proactive alert posting to configured channel.
- [ ] Document bot setup and permissions.

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
