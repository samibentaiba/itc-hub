import { NextResponse, NextRequest} from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Transform to match frontend settings interface
    const settingsData = {
      profile: {
        name: user.name,
        email: user.email,
        bio: user.profile?.bio || ""
      },
      notifications: {
        email: true,
        push: true,
        ticketUpdates: true,
        mentions: true
      },
      theme: "dark" as const
    }

    return NextResponse.json(settingsData)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { profile } = body

    // Update user settings (for now just profile data)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: profile?.name || undefined,
        profile: {
          upsert: {
            create: {
              bio: profile?.bio || ""
            },
            update: {
              bio: profile?.bio || undefined
            }
          }
        }
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}