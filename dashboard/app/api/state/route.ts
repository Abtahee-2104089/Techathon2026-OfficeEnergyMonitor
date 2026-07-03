import { getEnergyState } from "@/lib/energy-simulator"

export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json(getEnergyState(), {
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
