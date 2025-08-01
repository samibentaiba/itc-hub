import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WorkspaceProvider } from "@/components/workspace-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { WorkspaceLayout } from "@/components/workspace-layout"

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background `} >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} >
          <WorkspaceProvider>
            <SidebarProvider >
              <AppSidebar />
              <WorkspaceLayout >{children}</WorkspaceLayout>
            </SidebarProvider>
            <Toaster />
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
