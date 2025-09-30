import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { sessionId, ...data } = await req.json()

    let session

    if (sessionId) {
      // Reusar la sesión existente
      session = await prisma.userSession.findUnique({
        where: { id: sessionId },
      })
    }

    if (!session) {
      // Si no existe, crear una nueva
      session = await prisma.userSession.create({
        data: {},
      })
    }

    
    for (const [question, response] of Object.entries(data)) {
      await prisma.answer.create({
        data: {
          sessionId: session.id,
          question,
          response: response as string,
        },
      })
    }

    return NextResponse.json({ ok: true, sessionId: session.id })
  } catch (error) {
    console.error("Error en API /save:", error)
    return NextResponse.json(
      { error: "Error al guardar respuestas" },
      { status: 500 }
    )
  }
}
