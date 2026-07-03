# Architecture

## Overview

The system has one source of truth: the backend. The simulated device layer updates the backend state, and both the dashboard and Discord bot read from that same backend.

```text
Office Device Simulator
  -> Backend State Store
    -> REST API
    -> WebSocket Events
      -> Web Dashboard
      -> Discord Bot
```

The final visual system diagram should be exported as an image, not Mermaid.

## Components

### Device Simulator

Responsible for:

- Defining the rooms and devices.
- Changing device states over time.
- Tracking timestamps.
- Producing realistic watt usage.

### Backend API

Responsible for:

- Serving current state.
- Calculating current power usage.
- Calculating room-level usage.
- Generating alerts.
- Broadcasting live updates.

### Web Dashboard

Responsible for:

- Visualizing room layout.
- Showing live device states.
- Showing live power consumption.
- Showing active alerts.
- Making the system easy to understand in a demo.

### Discord Bot

Responsible for:

- Answering office status commands.
- Reading real backend data.
- Posting proactive alert messages when configured.

## Data Flow

1. The simulator updates one or more device states.
2. Backend recalculates usage and alerts.
3. Backend broadcasts `state:update`.
4. Dashboard receives the update and animates the new state.
5. Discord bot reads the same backend state when a command is used.
6. If a new alert is detected, the bot may post it to a Discord channel.

## API Contract

```text
GET /api/health
```

Returns service health.

```text
GET /api/state
```

Returns rooms, devices, usage, alerts, and timestamp.

```text
GET /api/rooms
```

Returns room summaries.

```text
GET /api/rooms/:roomId
```

Returns one room with its devices and usage.

```text
GET /api/usage
```

Returns total watts, room-level watts, and estimated kWh.

```text
GET /api/alerts
```

Returns active alerts.

## Realtime Contract

```text
state:update
```

Broadcast whenever the simulator changes state or alerts are recalculated.

## Reliability Notes

- The dashboard should show a disconnected state if WebSocket drops.
- The Discord bot should handle backend errors with a friendly retry message.
- The simulator should avoid impossible values, such as a device drawing watts while off.
