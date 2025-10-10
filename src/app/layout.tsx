import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Roboto } from "next/font/google";
import {Wrapper} from "./wrapper";

const roboto = Roboto({ subsets: ["latin"] })

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} bg-background`}>
        <Wrapper>
          {children}
        </Wrapper>
      </body>
    </html>
  )
}
