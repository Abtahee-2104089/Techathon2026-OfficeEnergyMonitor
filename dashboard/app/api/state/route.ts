import { getEnergyState } from "@/lib/energy-simulator"
import { syncEnergyStateToInstant } from "@/lib/instant-admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const state = getEnergyState()

  syncEnergyStateToInstant(state).catch((error) => {
    console.error("InstantDB sync failed", error)
  })

  return Response.json(state, {
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
