import { config } from "./config"
import type { EnergyAlert, EnergyState, RoomSummary } from "./types"

type CommandResponseInput = {
  command: string
  fallback: string
  state: EnergyState
  room?: RoomSummary
  roomQuery?: string
}

type StaticResponseInput = {
  command: string
  fallback: string
  context?: string
}

function fallbackAdvice(state: EnergyState) {
  const activeRooms = state.rooms.filter((room) => room.activeDevices > 0)
  const highestRoom = [...state.rooms].sort(
    (a, b) => b.totalWatts - a.totalWatts
  )[0]

  if (activeRooms.length === 0) {
    return "The office is quiet right now. No lights or fans are drawing power, so there is nothing urgent to fix."
  }

  const firstStep = highestRoom
    ? `Check ${highestRoom.name} first because it is drawing ${highestRoom.totalWatts}W.`
    : "Check the room with the most active devices first."
  const scheduleNote = state.isAfterHours
    ? "Because it is after hours, this is likely wasted energy unless someone is still working."
    : "Because it is office hours, confirm the room is actually occupied before switching anything off."

  return `${activeRooms.length} room${activeRooms.length === 1 ? "" : "s"} still have active devices. ${firstStep} ${scheduleNote}`
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildPrompt(state: EnergyState) {
  const rooms = state.rooms
    .map(
      (room) =>
        `${room.name}: ${room.activeDevices}/${room.devices.length} active, ${room.fansOn} fans, ${room.lightsOn} lights, ${room.totalWatts}W`
    )
    .join("\n")
  const alerts = state.alerts.length
    ? state.alerts
        .map((alert) => `${alert.severity}: ${alert.title} - ${alert.message}`)
        .join("\n")
    : "No active alerts."

  return [
    "You are a friendly Discord energy assistant for a small office.",
    "Give one concise paragraph with practical advice. Do not mention JSON.",
    "",
    `Clock: ${state.simulatedClock}`,
    `After hours: ${state.isAfterHours}`,
    `Total load: ${state.totalWatts}W`,
    `Estimated kWh today: ${state.estimatedTodayKwh}`,
    "Rooms:",
    rooms,
    "Alerts:",
    alerts,
  ].join("\n")
}

async function callOpenRouter({
  system,
  user,
  maxTokens = 220,
  temperature = 0.65,
}: {
  system: string
  user: string
  maxTokens?: number
  temperature?: number
}) {
  if (!config.openRouterApiKey) {
    return null
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/Seyamalam/Techathon2026-Huntrix",
      "X-Title": "Techathon Office Energy Monitor Discord Bot",
    },
    body: JSON.stringify({
      model: config.openRouterModel,
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: user,
        },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content?.trim()

  return content ? clampDiscordMessage(content) : null
}

function clampDiscordMessage(content: string) {
  const cleaned = sanitizeModelText(content)

  if (cleaned.length <= 1800) {
    return cleaned
  }

  return `${cleaned.slice(0, 1770).trimEnd()}\n...`
}

function sanitizeModelText(content: string) {
  const normalized = content
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .trim()

  const leakedReasoningMarkers = [
    "Let's craft:",
    "I'll format:",
    "I'll output:",
    "We'll output:",
    "Final answer:",
    "Answer:",
    "Reply:",
  ]
  const marker = leakedReasoningMarkers.find((item) =>
    normalized.toLowerCase().includes(item.toLowerCase())
  )

  if (marker) {
    return normalized
      .slice(normalized.toLowerCase().lastIndexOf(marker.toLowerCase()) + marker.length)
      .replace(/^["'`]+|["'`]+$/g, "")
      .trim()
  }

  const cutBeforeMarkers = [
    "\n\nWe can ",
    "\n\nBetter ",
    "\n\nMaybe ",
    "\n\nLet's ",
    "\n\nI should ",
  ]
  const cutMarker = cutBeforeMarkers.find((item) => normalized.includes(item))
  const answerOnly = cutMarker
    ? normalized.slice(0, normalized.indexOf(cutMarker)).trim()
    : normalized

  const filtered = answerOnly
    .split("\n")
    .filter((line) => {
      const lower = line.trim().toLowerCase()

      return (
        !lower.startsWith("we need to") &&
        !lower.startsWith("i need to") &&
        !lower.startsWith("let's ") &&
        !lower.startsWith("maybe ") &&
        !lower.startsWith("we should ") &&
        !lower.startsWith("also live state") &&
        !lower.startsWith("the answer should")
      )
    })
    .join("\n")
    .trim()

  if (filtered.split("```").length % 2 === 0) {
    return filtered.replace(/```/g, "").trim()
  }

  return filtered
}

function looksIncomplete(content: string) {
  const trimmed = content.trim()
  const lower = trimmed.toLowerCase()

  return (
    lower === "user safety: safe" ||
    lower.startsWith("user safety:") ||
    lower.startsWith("safe") ||
    trimmed.length < 24 ||
    trimmed.endsWith("-") ||
    trimmed.endsWith(":") ||
    /\n-\s*\d+$/.test(trimmed) ||
    trimmed.split("```").length % 2 === 0
  )
}

function stateContext(state: EnergyState) {
  return JSON.stringify(
    {
      clock: state.simulatedClock,
      afterHours: state.isAfterHours,
      totalWatts: state.totalWatts,
      estimatedTodayKwh: state.estimatedTodayKwh.toFixed(2),
      activeDevices: state.activeDevices,
      deviceCount: state.deviceCount,
      rooms: state.rooms.map((room) => ({
        name: room.name,
        totalWatts: room.totalWatts,
        activeDevices: room.activeDevices,
        deviceCount: room.devices.length,
        fansOn: room.fansOn,
        lightsOn: room.lightsOn,
        devices: room.devices.map((device) => ({
          name: device.name,
          type: device.type,
          status: device.status,
          watts: device.watts,
          ratedWatts: device.ratedWatts,
          minutesInCurrentState: device.minutesInCurrentState,
        })),
      })),
      alerts: state.alerts.map((alert) => ({
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        roomId: alert.roomId ?? null,
      })),
    },
    null,
    2
  )
}

export async function formatAiCommandResponse({
  command,
  fallback,
  state,
  room,
  roomQuery,
}: CommandResponseInput) {
  if (!config.openRouterApiKey) {
    return fallback
  }

  try {
    const roomDetails = room
      ? [
          `Requested room: ${room.name}`,
          `Room total: ${room.totalWatts}W`,
          `Room active devices: ${room.activeDevices}/${room.devices.length}`,
          "Room devices:",
          room.devices
            .map(
              (device) =>
                `${device.name}: ${device.status}, ${device.watts}W of ${device.ratedWatts}W, changed ${device.minutesInCurrentState} minutes ago`
            )
            .join("\n"),
        ].join("\n")
      : roomQuery
        ? `Requested room query: ${roomQuery}`
        : "No specific room requested."
    const system = [
      "You are a helpful coworker inside a Discord server for a small office energy monitor.",
      "Write a natural message for the user's command using the live data. Do not sound like a fixed template.",
      "Vary wording and structure. Use a short paragraph, a few bullets, or compact markdown only when it genuinely helps.",
      "Use only the provided facts. Do not invent devices, rooms, wattage, or alerts.",
      "This Discord bot is read-only monitoring. Do not offer to turn devices on, turn devices off, power anything down, or take control actions.",
      "Write the final Discord reply only. Do not reveal planning, chain-of-thought, drafts, or explanations of how you will answer.",
      "Discord markdown is allowed: bold, bullets, inline code, short code blocks, and simple ASCII bars.",
      "Do not use HTML. Do not mention JSON or data structures.",
      "Keep the reply under 900 characters.",
    ].join(" ")
    const user = [
      `Command: !${command}`,
      "Room query if any:",
      roomQuery || "none",
      "",
      "Live office data:",
      stateContext(state),
      "",
      "Extra room details:",
      roomDetails,
    ].join("\n")

    const content = await callOpenRouter({
      system,
      user,
      maxTokens: 320,
      temperature: 0.78,
    })

    if (content && !looksIncomplete(content)) {
      return content
    }

    await sleep(700)

    const retry = await callOpenRouter({
      system: `${system} Your previous answer was missing or too thin. Write a fresh, complete Discord reply now.`,
      user,
      maxTokens: 320,
      temperature: 0.82,
    })

    return retry && !looksIncomplete(retry) ? retry : fallback
  } catch {
    return fallback
  }
}

export async function formatAiStaticResponse({
  command,
  fallback,
  context,
}: StaticResponseInput) {
  if (!config.openRouterApiKey) {
    return fallback
  }

  try {
    const content = await callOpenRouter({
      system: [
        "You are the Discord bot for a live office energy monitor.",
        "Write a natural Discord message. Do not sound like a fixed template.",
        "Use only the command facts provided. Keep command names exact.",
        "This Discord bot is read-only monitoring. Do not offer control actions.",
        "Return the final reply only. Discord markdown is allowed. Do not use HTML.",
        "Keep the reply under 900 characters.",
      ].join(" "),
      user: [
        `Incoming command: !${command}`,
        "",
        "Facts to communicate:",
        fallback,
        context ? `\nExtra context:\n${context}` : "",
      ].join("\n"),
      maxTokens: 220,
      temperature: 0.8,
    })

    return content && !looksIncomplete(content) ? content : fallback
  } catch {
    return fallback
  }
}

export async function formatAiAdvice(state: EnergyState) {
  if (!config.openRouterApiKey) {
    return fallbackAdvice(state)
  }

  try {
    const content = await callOpenRouter({
      system:
        "You are a helpful coworker giving energy-saving advice in Discord. Use the live IoT facts, sound natural, avoid templates, and return only the final message. Discord markdown is allowed. Keep it concise. The bot is read-only monitoring, so do not offer to switch devices or take control actions.",
      user: buildPrompt(state),
      maxTokens: 180,
      temperature: 0.75,
    })

    return content || fallbackAdvice(state)
  } catch {
    return fallbackAdvice(state)
  }
}

export async function formatAiAlert(alert: EnergyAlert) {
  const fallback = `${alert.severity === "critical" ? "Critical" : "Heads up"}: ${alert.title}. ${alert.message}`

  if (!config.openRouterApiKey) {
    return fallback
  }

  try {
    const content = await callOpenRouter({
      system:
        "You write short proactive Discord alert messages for office energy monitoring. Sound like a helpful teammate, not a template. Return only the final message. Keep it factual and under 500 characters. The bot is read-only monitoring, so do not offer to switch devices or take control actions.",
      user: [
        `Severity: ${alert.severity}`,
        `Title: ${alert.title}`,
        `Message: ${alert.message}`,
        `Timestamp: ${alert.timestamp}`,
        alert.roomId ? `Room ID: ${alert.roomId}` : "Room ID: none",
      ].join("\n"),
      maxTokens: 120,
      temperature: 0.72,
    })

    return content || fallback
  } catch {
    return fallback
  }
}
