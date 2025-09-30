import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any = {}
    try {
      body = await req.json()
    } catch {
      body = {}
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      )
    }

    const { sessionId, ...data } = body
    let session = null

    // Buscar sesión existente si se manda un id
    if (sessionId) {
      session = await prisma.userSession.findUnique({
        where: { id: sessionId },
      })
    }

    // Crear nueva sesión si no existe
    if (!session) {
      session = await prisma.userSession.create({
        data: {},
      })
    }

    const entries = Object.entries(data)

    // Si hay respuestas, guardarlas
    if (entries.length > 0) {
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
