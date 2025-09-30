"use client"

import { motion } from "framer-motion"

export default function Mascota() {
  return (
    <motion.div
      className="relative w-36 h-36 bg-red-500 rounded-3xl flex items-center justify-center shadow-xl"
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {/* Antena */}
      <div className="absolute -top-6 w-1 h-6 bg-red-600 rounded-full">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-md border-2 border-white"></div>
      </div>

      {/* Brillo superior izquierdo */}
      <div className="absolute top-3 left-3 w-5 h-5 bg-white/60 rounded-full blur-[2px]"></div>

      {/* Ojo izquierdo */}
      <div className="absolute left-7 top-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
        <div className="w-3 h-3 bg-black rounded-full"></div>
      </div>

      {/* Ojo derecho */}
      <div className="absolute right-7 top-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
        <div className="w-3 h-3 bg-black rounded-full"></div>
      </div>

      {/* Boca */}
      <div className="absolute bottom-8 w-12 h-2 bg-black/80 rounded-full"></div>
    </motion.div>
  )
}
