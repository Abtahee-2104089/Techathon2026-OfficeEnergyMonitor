"use client"

import { useEffect, useState } from "react"

import { instantDb } from "@/lib/instant"
import type { EnergyState } from "@/lib/energy-simulator"

export const initialEnergyState: EnergyState = {
  generatedAt: new Date(0).toISOString(),
  simulatedClock: "--:--:--",
  isAfterHours: false,
  totalWatts: 0,
  estimatedTodayKwh: 0,
  activeDevices: 0,
  deviceCount: 15,
  rooms: [],
  alerts: [],
}

export function useEnergyState() {
  const [apiState, setApiState] = useState<EnergyState>(initialEnergyState)
  const [apiConnection, setApiConnection] = useState<
    "connecting" | "live" | "offline"
  >("connecting")
  const instantQuery = instantDb?.useQuery({ snapshots: {} })
  const instantSnapshot = instantQuery?.data?.snapshots.find(
    (snapshot) => snapshot.snapshotId === "current"
  )

  useEffect(() => {
    let active = true

    async function loadState() {
      try {
        const response = await fetch("/api/state", { cache: "no-store" })

        if (!response.ok) {
          throw new Error(`State request failed: ${response.status}`)
        }

        const nextState = (await response.json()) as EnergyState

        if (active) {
          setApiState(nextState)
          setApiConnection("live")
        }
      } catch {
        if (active) {
          setApiConnection("offline")
        }
      }
    }

    loadState()
    const timer = window.setInterval(loadState, 1500)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  const state = instantSnapshot?.payload ?? apiState
  const connection = instantSnapshot?.payload ? "live" : apiConnection

  return { state, connection }
}
