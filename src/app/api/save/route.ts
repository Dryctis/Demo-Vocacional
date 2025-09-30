import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      )
    }

    const { sessionId, ...data } = body
    let session = null

    if (sessionId) {
      session = await prisma.userSession.findUnique({
        where: { id: sessionId },
      })
    }

    if (!session) {
      session = await prisma.userSession.create({
        data: {},
      })
    }

    // Guardar respuestas
    const entries = Object.entries(data)
    if (entries.length === 0) {
      return NextResponse.json(
        { error: "No hay respuestas para guardar" },
        { status: 400 }
      )
    }

    await prisma.$transaction(
      entries.map(([question, response]) =>
        prisma.answer.create({
          data: {
            sessionId: session!.id,
            question,
            response: response ? String(response) : null,
          },
        })
      )
    )

    return NextResponse.json({ ok: true, sessionId: session.id })
  } catch (error) {
    console.error("Error en API /save:", error)
    return NextResponse.json(
      { error: "Error al guardar respuestas" },
      { status: 500 }
    )
  }
}
