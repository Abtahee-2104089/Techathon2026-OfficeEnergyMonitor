FROM oven/bun:1.3.14-alpine AS base
WORKDIR /app

COPY package.json ./
COPY dashboard/package.json dashboard/bun.lock ./dashboard/
COPY bot/package.json bot/bun.lock ./bot/

RUN bun install --cwd dashboard --frozen-lockfile \
  && bun install --cwd bot --frozen-lockfile

COPY dashboard ./dashboard
COPY bot ./bot

FROM base AS dashboard-build
RUN bun run --cwd dashboard build

FROM oven/bun:1.3.14-alpine AS dashboard
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dashboard-build /app/dashboard ./dashboard
EXPOSE 3000
WORKDIR /app/dashboard
CMD ["bun", "run", "start"]

FROM base AS bot
WORKDIR /app/bot
CMD ["bun", "run", "start"]
