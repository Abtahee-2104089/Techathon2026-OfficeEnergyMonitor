import type { InstantRules } from "@instantdb/react"

import type schema from "./instant.schema"

const readOnly = {
  allow: {
    view: "true",
    create: "false",
    update: "false",
    delete: "false",
  },
}

const rules = {
  snapshots: readOnly,
  rooms: readOnly,
  devices: readOnly,
  readings: readOnly,
  alerts: readOnly,
} satisfies InstantRules<typeof schema>

export default rules
