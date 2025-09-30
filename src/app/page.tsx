"use client"

import { useState, useEffect } from "react"
import Background from "@/components/Background"
import Mascota from "@/components/Mascota"
import Stepper, { Step } from "@/components/Stepper"
import Results from "@/components/Results"

export default function Page() {
  const [respuestas, setRespuestas] = useState({
    nombre: "",
    edad: "",
    opcion: "",
  })
  const [finalizado, setFinalizado] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Crear sesión al cargar
  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await fetch("/api/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
        if (res.ok) {
          const { sessionId } = await res.json()
          setSessionId(sessionId)
          console.log("Nueva sesión creada ✅", sessionId)
        } else {
          console.error("Error creando sesión ❌")
        }
      } catch (err) {
        console.error("Error de red creando sesión:", err)
      }
    }
    startSession()
  }, [])

  // Validar antes de avanzar
  const validarPaso = (paso: number): boolean => {
    setError(null)
    if (paso === 1 && !respuestas.nombre.trim()) {
      setError("Debes ingresar tu nombre.")
      return false
    }
    if (paso === 2 && (!respuestas.edad.trim() || parseInt(respuestas.edad) <= 0)) {
      setError("Debes ingresar una edad válida.")
      return false
    }
    if (paso === 3 && !respuestas.opcion) {
      setError("Debes seleccionar un área de interés.")
      return false
    }
    return true
  }

  // Guardar todas las respuestas antes de finalizar
  const handleFinalizar = async () => {
    if (!sessionId) {
      console.error("No hay sessionId para guardar las respuestas ❌")
      return
    }

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...respuestas }),
      })

      if (res.ok) {
        console.log("Respuestas guardadas correctamente ✅")
        setFinalizado(true)
      } else {
        console.error("Error al guardar respuestas ❌")
      }
    } catch (error) {
      console.error("Error de red:", error)
    }
  }

  // Descargar PDF
  const handleDownload = async () => {
    if (!sessionId) {
      console.error("No hay sessionId disponible ❌")
      return
    }

    const res = await fetch(`/api/pdf?sessionId=${sessionId}`, { method: "GET" })

    if (!res.ok) {
      console.error("Error al generar PDF ❌")
      return
    }

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "respuestas.pdf"
    a.click()
    a.remove()
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Background />
      <div className="relative z-10 w-full max-w-2xl p-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
        <div className="flex justify-center -mt-20 mb-4">
          <Mascota />
        </div>

        {!finalizado ? (
          <>
            <Stepper onFinalStepCompleted={handleFinalizar} validateStep={validarPaso}>
              <Step>
                <h2 className="font-bold mb-2">Pregunta 1</h2>
                <input
                  type="text"
                  placeholder="¿Cuál es tu nombre?"
                  value={respuestas.nombre}
                  onChange={(e) => setRespuestas({ ...respuestas, nombre: e.target.value })}
                  className="w-full p-3 rounded-md bg-neutral-800/80 border border-neutral-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </Step>
              <Step>
                <h2 className="font-bold mb-2">Pregunta 2</h2>
                <input
                  type="number"
                  placeholder="¿Cuál es tu edad?"
                  value={respuestas.edad}
                  onChange={(e) => setRespuestas({ ...respuestas, edad: e.target.value })}
                  className="w-full p-3 rounded-md bg-neutral-800/80 border border-neutral-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </Step>
              <Step>
                <h2 className="font-bold mb-2">Pregunta 3</h2>
                <select
                  value={respuestas.opcion}
                  onChange={(e) => setRespuestas({ ...respuestas, opcion: e.target.value })}
                  className="w-full p-3 rounded-md bg-neutral-800/80 border border-neutral-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Selecciona un área de interés</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Medicina">Medicina</option>
                  <option value="Finanzas">Finanzas</option>
                </select>
              </Step>
            </Stepper>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </>
        ) : (
          <Results respuestas={respuestas} onDownload={handleDownload} />
        )}
      </div>
    </div>
  )
}
