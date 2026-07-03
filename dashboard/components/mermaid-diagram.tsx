"use client"

import { useEffect, useId, useState } from "react"

import { cn } from "@/lib/utils"

export function MermaidDiagram({
  chart,
  className,
}: {
  chart: string
  className?: string
}) {
  const reactId = useId()
  const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`
  const [svg, setSvg] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "dark",
          flowchart: {
            htmlLabels: true,
          },
        })

        const result = await mermaid.render(diagramId, chart)

        if (active) {
          setSvg(result.svg)
          setError("")
        }
      } catch (renderError) {
        if (active) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Unable to render Mermaid diagram."
          )
          setSvg("")
        }
      }
    }

    renderDiagram()

    return () => {
      active = false
    }
  }, [chart, diagramId])

  if (error) {
    return (
      <pre className="overflow-auto rounded-lg border bg-muted p-4 text-xs leading-5 text-muted-foreground">
        {`Mermaid render fallback: ${error}\n\n${chart.trim()}`}
      </pre>
    )
  }

  return (
    <div
      className={cn(
        "overflow-auto rounded-lg border bg-muted/20 p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-none",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
