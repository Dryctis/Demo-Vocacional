import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const session = await prisma.userSession.create({ data: {} })
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creando sesión:", error)
    return NextResponse.json({ error: "Error creando sesión" }, { status: 500 })
  }
}
