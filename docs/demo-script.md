# Demo Script

Target length: under 3 minutes.

## 0:00 - 0:15 Problem

"Our office uses Discord for everything, but lights and fans are often left on after work. This system gives the boss a live dashboard and a Discord bot to monitor device status and power usage."

## 0:15 - 1:10 Dashboard

Show:

- Top-view office layout.
- Lights glowing when on.
- Fans spinning when on.
- Live device panel.
- Total power meter.
- Per-room usage.
- Active alerts.

Mention that updates happen live without refreshing.

## 1:10 - 1:50 Discord Bot

Run:

```text
!status
!room work1
!usage
```

Mention that the bot reads from the same backend as the dashboard.

## 1:50 - 2:20 Architecture

Show the system diagram:

```text
simulated devices -> backend -> dashboard and Discord bot
```

Emphasize one source of truth.

## 2:20 - 2:45 Hardware Concept

Show the schematic screenshot and explain that one representative room is modeled with an ESP32, device state inputs, and optional current sensing.

## 2:45 - 3:00 Close

"The result is a working real-time monitoring prototype that can be extended to real IoT sensors and office automation."
