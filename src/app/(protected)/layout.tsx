import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Provider } from "@/components/provider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ITC Hub",
  description: "A modern workspace platform for the Information Technology Community",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Provider>{children}</Provider>
  )
}
