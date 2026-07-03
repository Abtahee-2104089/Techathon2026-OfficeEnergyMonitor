"use client"

import type {} from "@wokwi/elements"
import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { useEnergyState } from "@/hooks/use-energy-state"
import type { Device } from "@/lib/energy-simulator"
import { hardwareDevices } from "@/lib/hardware-circuit"
import { cn } from "@/lib/utils"

export function WokwiCircuitPreview() {
  const [ready, setReady] = useState(false)
  const { state, connection } = useEnergyState()
  const drawingRoom = state.rooms.find((room) => room.id === "drawing-room")
  const liveDevices = useMemo(
    () =>
      new Map(
        drawingRoom?.devices.map((device) => [device.id, device]) ??
          ([] as Array<[string, Device]>)
      ),
    [drawingRoom?.devices]
  )
  const activeCount =
    drawingRoom?.devices.filter((device) => device.status === "on").length ?? 0
  const roomWatts = drawingRoom?.totalWatts ?? 0

  useEffect(() => {
    let active = true

    import("@wokwi/elements").then(() => {
      if (active) {
        setReady(true)
      }
    })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3">
        <div>
          <div className="text-sm font-medium">Drawing Room Wokwi preview</div>
          <div className="text-xs text-muted-foreground">
            Live state drives the switch positions, relay labels, and LEDs.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={connection === "live" ? "default" : "secondary"}>
            {connection}
          </Badge>
          <Badge variant="outline">{activeCount}/5 on</Badge>
          <Badge variant="outline">{roomWatts}W</Badge>
        </div>
      </div>

      <div className="overflow-x-auto bg-background">
        <div className="min-w-[1040px] p-5">
          <div className="mb-5">
            <div className="text-xl font-semibold">
              ESP32 relay and state-sensing circuit
            </div>
            <div className="text-sm text-muted-foreground">
              Same Drawing Room device IDs and wattages as the simulator.
            </div>
          </div>

          <div className="grid grid-cols-[210px_140px_72px_140px_72px_1fr] gap-x-5 gap-y-3">
            <div />
            <HeaderLabel>Sense input</HeaderLabel>
            <HeaderLabel>Limit</HeaderLabel>
            <HeaderLabel>Relay</HeaderLabel>
            <HeaderLabel>Load LED</HeaderLabel>
            <HeaderLabel>Mapped device</HeaderLabel>

            <div className="row-span-5 flex items-center justify-center rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                {ready ? (
                  <wokwi-esp32-devkit-v1 ledPower led1={activeCount > 0} />
                ) : (
                  <Fallback label="ESP32" />
                )}
                <div className="text-center">
                  <div className="text-sm font-medium">ESP32 DevKit</div>
                  <div className="text-xs text-muted-foreground">
                    reads inputs, drives relays
                  </div>
                </div>
              </div>
            </div>

            {hardwareDevices.map((device) => {
              const live = liveDevices.get(device.id)
              const isOn = live?.status === "on"

              return (
                <CircuitRow
                  key={device.id}
                  ready={ready}
                  active={isOn}
                  device={device}
                />
              )
            })}
          </div>

          <div className="mt-5 rounded-lg border bg-card p-3 text-xs text-card-foreground shadow-sm">
            <div className="font-medium">Serial payload example</div>
            <code className="mt-1 block truncate text-muted-foreground">
              {"{\"id\":\"drawing-room-fan-1\",\"status\":\"on\",\"watts\":60,\"ratedWatts\":60}"}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

function CircuitRow({
  ready,
  active,
  device,
}: {
  ready: boolean
  active: boolean
  device: (typeof hardwareDevices)[number]
}) {
  return (
    <>
      <WokwiPart>
        {ready ? (
          <wokwi-slide-switch value={active ? 1 : 0} />
        ) : (
          <Fallback label="SW" />
        )}
        <PartText title={device.name} detail={device.sense} />
      </WokwiPart>

      <Connector active={active} />

      <WokwiPart>
        {ready ? <wokwi-resistor value="220" /> : <Fallback label="R" />}
        <PartText title="220 ohm" detail="indicator limit" />
      </WokwiPart>

      <Connector active={active} />

      <WokwiPart>
        {ready ? <wokwi-ks2e-m-dc5 /> : <Fallback label="Relay" />}
        <PartText title={`${device.relay} relay`} detail={device.output} />
      </WokwiPart>

      <Connector active={active} />

      <WokwiPart
        className={cn(
          "rounded-full",
          active && "shadow-[0_0_22px_hsl(var(--primary)/0.45)]"
        )}
      >
        {ready ? (
          <wokwi-led
            color={device.ledColor}
            value={active}
            brightness={active ? 1 : 0.08}
            label=""
          />
        ) : (
          <Fallback label="LED" />
        )}
      </WokwiPart>

      <div className="flex h-[78px] items-center rounded-lg border bg-card p-3 shadow-sm">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">
            {device.name} {device.ratedWatts}W
          </div>
          <div className="truncate font-mono text-[10px] text-muted-foreground">
            {device.id}
          </div>
          <Badge variant={active ? "default" : "outline"} className="mt-2">
            {active ? "on" : "off"}
          </Badge>
        </div>
      </div>
    </>
  )
}

function HeaderLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-1 text-xs font-medium uppercase text-muted-foreground">
      {children}
    </div>
  )
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className="flex h-[78px] items-center">
      <div
        className={cn(
          "h-1 w-full rounded-full bg-border",
          active && "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.55)]"
        )}
      />
    </div>
  )
}

function WokwiPart({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex h-[78px] items-center justify-center gap-2 rounded-lg border bg-card p-2 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

function PartText({
  title,
  detail,
}: {
  title: string
  detail: string
}) {
  return (
    <div className="min-w-0">
      <div className="truncate text-xs font-medium">{title}</div>
      <div className="truncate font-mono text-[10px] text-muted-foreground">
        {detail}
      </div>
    </div>
  )
}

function Fallback({ label }: { label: string }) {
  return (
    <div className="flex h-10 min-w-12 items-center justify-center rounded border bg-muted px-2 text-[10px] text-muted-foreground">
      {label}
    </div>
  )
}
