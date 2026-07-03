import {
  Client,
  Events,
  GatewayIntentBits,
} from "discord.js"

import { fetchEnergyState, findRoom } from "./api"
import { assertConfig, config } from "./config"
import {
  formatAlert,
  formatHelp,
  formatRoom,
  formatStatus,
  formatUsage,
} from "./formatters"

assertConfig()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

const postedAlertIds = new Set<string>()

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Office energy bot logged in as ${readyClient.user.tag}`)
  startAlertPolling()
})

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) {
    return
  }

  const [commandName = "", ...args] = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/\s+/)
  const command = commandName.toLowerCase()

  try {
    if (command === "help" || command === "commands") {
      await message.reply(formatHelp(config.prefix))
      return
    }

    if (!["status", "room", "usage"].includes(command)) {
      await message.reply(
        `I don't know that command yet. Try \`${config.prefix}help\`.`
      )
      return
    }

    const state = await fetchEnergyState()

    if (command === "status") {
      await message.reply(formatStatus(state))
      return
    }

    if (command === "usage") {
      await message.reply(formatUsage(state))
      return
    }

    const roomQuery = args.join(" ")

    if (!roomQuery) {
      await message.reply(
        `Tell me which room to check: \`${config.prefix}room drawing\`, \`${config.prefix}room work1\`, or \`${config.prefix}room work2\`.`
      )
      return
    }

    const room = findRoom(state, roomQuery)

    if (!room) {
      await message.reply(
        `I couldn't match that room. Try drawing, work1, or work2.`
      )
      return
    }

    await message.reply(formatRoom(room))
  } catch (error) {
    console.error(error)
    await message.reply(
      "I couldn't reach the energy backend right now. Make sure the dashboard server is running."
    )
  }
})

async function startAlertPolling() {
  if (!config.channelId) {
    console.log("DISCORD_CHANNEL_ID is not set; proactive alert posting is off.")
    return
  }

  await pollAlerts()
  setInterval(pollAlerts, config.alertPollMs)
}

async function pollAlerts() {
  try {
    const state = await fetchEnergyState()
    const newAlerts = state.alerts.filter((alert) => !postedAlertIds.has(alert.id))

    if (newAlerts.length === 0) {
      return
    }

    const channel = await client.channels.fetch(config.channelId)

    if (!isSendableChannel(channel)) {
      console.warn("Configured alert channel is not text-capable.")
      return
    }

    for (const alert of newAlerts) {
      await channel.send(formatAlert(alert))
      postedAlertIds.add(alert.id)
    }
  } catch (error) {
    console.error("Alert polling failed:", error)
  }
}

type SendableChannel = {
  send: (content: string) => Promise<unknown>
}

function isSendableChannel(channel: unknown): channel is SendableChannel {
  if (!channel || typeof channel !== "object") {
    return false
  }

  return "send" in channel && typeof channel.send === "function"
}

await client.login(config.token)
