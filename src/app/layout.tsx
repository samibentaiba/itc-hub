import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Roboto } from "next/font/google";
import {Wrapper} from "./wrapper";
import { VersionDisplay } from "../components/VersionDisplay";

const roboto = Roboto({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ITC Hub",
  description: "A modern workspace platform for the Information Technology Community",
  generator: null,
  metadataBase: new URL('https://itc-hub.vercel.app'),

  openGraph: {
    title: "ITC Hub",
    description: "A modern workspace platform for the Information Technology Community",
    images: ["/ITC HUB Home.png"],
    url: "https://itc-hub.vercel.app",
    siteName: "ITC Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITC Hub",
    description: "A modern workspace platform for the Information Technology Community",
    images: ["/ITC HUB Home.png"],
    creator: "@itc_hub",
  },
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
          <VersionDisplay />
        </Wrapper>
      </body>
    </html>
  )
}
