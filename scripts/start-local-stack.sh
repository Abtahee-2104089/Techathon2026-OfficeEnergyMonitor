#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
INSTANT_DIR="$ROOT_DIR/.docker/instant"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required for the local stack." >&2
  exit 1
fi

mkdir -p "$ROOT_DIR/.docker"

if [ ! -d "$INSTANT_DIR/.git" ]; then
  git clone https://github.com/instantdb/instant.git "$INSTANT_DIR"
fi

cd "$INSTANT_DIR/self-hosting"

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ -f docker-compose.yml ]; then
  perl -0pi -e "s/'3000:3000'/'3001:3000'/g; s/\"3000:3000\"/\"3001:3000\"/g" docker-compose.yml
fi

if grep -q '^INSTANT_DASHBOARD_URL=' .env; then
  perl -0pi -e 's#^INSTANT_DASHBOARD_URL=.*#INSTANT_DASHBOARD_URL=http://localhost:3001#m' .env
fi

docker compose --env-file .env up -d

cd "$ROOT_DIR"
docker compose up --build dashboard
