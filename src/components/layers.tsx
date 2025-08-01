"use client"

import type { ReactNode } from "react"

interface LayersProps {
  children: ReactNode
}

export function Layers({ children }: LayersProps) {
  return <div className="relative">{children}</div>
}
