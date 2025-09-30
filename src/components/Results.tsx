"use client"

interface ResultsProps {
  respuestas: {
    nombre: string
    edad: string
    opcion: string
  }
  onDownload: (respuestas: { nombre: string; edad: string; opcion: string }) => void
}

export default function Results({ respuestas, onDownload }: ResultsProps) {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-xl font-bold">🎉 ¡Resultados del cuestionario!</h2>
      <p><strong>Nombre:</strong> {respuestas.nombre}</p>
      <p><strong>Edad:</strong> {respuestas.edad}</p>
      <p><strong>Área de interés:</strong> {respuestas.opcion}</p>

      <button
        onClick={() => onDownload(respuestas)}
        className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Descargar PDF
      </button>
    </div>
  )
}
