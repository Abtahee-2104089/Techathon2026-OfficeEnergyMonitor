import { init } from "@instantdb/react"

import schema from "@/instant.schema"

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID
const apiURI = process.env.NEXT_PUBLIC_INSTANT_API_URI
const websocketURI = process.env.NEXT_PUBLIC_INSTANT_WEBSOCKET_URI

export const instantDb = appId
  ? init({
      appId,
      schema,
      ...(apiURI ? { apiURI } : {}),
      ...(websocketURI ? { websocketURI } : {}),
    })
  : null
