# Submission Checklist

## Repository Package

- Repository name follows `Techathon2026-Huntrix`.
- README explains the problem, solution, architecture, stack, setup, and run instructions.
- README documents API endpoints.
- README documents Discord bot commands.
- README documents AI/LLM usage and fallback behavior.
- README links all official SVG diagrams.
- Dashboard, backend API, bot package, Wokwi files, and docs are included.
- Team contribution breakdown is filled in.
- Third-party libraries, APIs, assets, Wokwi, OpenRouter, InstantDB, and AI assistance are attributed.

## Local Verification

- `bun run check` passes.
- Docker dashboard command is documented: `docker compose up --build dashboard`.
- Self-hosted InstantDB command is documented: `./scripts/start-local-stack.sh`.
- Dashboard runs at `http://127.0.0.1:3000`.
- Shared backend state runs at `http://127.0.0.1:3000/api/state`.
- Discord bot reads the same backend state when credentials are provided.

## Final Portal Items

- Confirm the repository is public.
- Record the video using [demo-script.md](demo-script.md).
- Submit GitHub link, demo video link, and team details before the deadline.
