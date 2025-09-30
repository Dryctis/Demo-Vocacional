import { PDFDocument, StandardFonts } from "pdf-lib"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return new Response("sessionId requerido", { status: 400 })
    }

    const answers = await prisma.answer.findMany({
      where: { sessionId },
    })

    if (answers.length === 0) {
      return new Response("No se encontraron respuestas", { status: 404 })
    }

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 400])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    let y = 350
    page.drawText("Respuestas del formulario:", { x: 50, y, size: 16, font })
    y -= 40

    for (const a of answers) {
      page.drawText(`${a.question}: ${a.response ?? ""}`, {
        x: 50,
        y,
        size: 12,
        font,
      })
      y -= 25
    }

    const pdfBytes = await pdfDoc.save()

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=respuestas.pdf",
      },
    })
  } catch (error) {
    console.error("Error en /api/pdf:", error)
    return new Response("Error al generar PDF", { status: 500 })
  }
}
