import type React from "react"
import { Sparkles, TrendingUp } from "lucide-react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-500/20">
          <Sparkles className="h-6 w-6 text-red-600" />
        </div>
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {heading}
          </h1>
          {text && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-muted-foreground">{text}</p>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
