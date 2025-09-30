"use client"

import React, { useState, ReactNode } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"

interface StepperProps {
  children: ReactNode[]
  initialStep?: number
  onStepChange?: (step: number) => void
  onFinalStepCompleted?: () => void
  backButtonText?: string
  nextButtonText?: string
  validateStep?: (step: number) => boolean
}

interface StepProps {
  children: ReactNode
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = "Atrás",
  nextButtonText = "Siguiente",
  validateStep,
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [direction, setDirection] = useState(0)
  const stepsArray = React.Children.toArray(children)
  const totalSteps = stepsArray.length
  const isLastStep = currentStep === totalSteps
  const isCompleted = currentStep > totalSteps

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep)
    if (newStep > totalSteps) {
      onFinalStepCompleted()
    } else {
      onStepChange(newStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1)
      updateStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (validateStep && !validateStep(currentStep)) return

    if (!isLastStep) {
      setDirection(1)
      updateStep(currentStep + 1)
    } else {
      updateStep(totalSteps + 1)
    }
  }

  return (
    <div
      className="flex flex-col items-center w-full max-w-2xl mx-auto
      bg-white/5 backdrop-blur-md p-6 sm:p-10 rounded-2xl 
      shadow-xl border border-white/10 transition"
    >
      {/* Indicadores de pasos */}
      <div className="flex items-center justify-center mb-8 flex-wrap gap-3">
        {stepsArray.map((_, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === stepNumber
          const isComplete = currentStep > stepNumber

          return (
            <React.Fragment key={stepNumber}>
              <motion.div
                aria-current={isActive ? "step" : undefined}
                className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 
                  rounded-full font-semibold text-sm sm:text-lg
                  ${isActive
                    ? "bg-indigo-600 text-white"
                    : isComplete
                    ? "bg-green-500 text-white"
                    : "bg-neutral-700/70 text-gray-300"}`}
              >
                {stepNumber}
              </motion.div>
              {stepNumber < totalSteps && (
                <div className="hidden sm:block w-12 h-0.5 bg-neutral-600/50 mx-2"></div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Contenido dinámico */}
      <StepContentWrapper
        isCompleted={isCompleted}
        currentStep={currentStep}
        direction={direction}
      >
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>

      {/* Botones */}
      {!isCompleted && (
        <div className="flex flex-col sm:flex-row justify-between w-full mt-8 gap-3">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              aria-label="Volver al paso anterior"
              className="w-full sm:w-auto px-5 py-3 rounded-lg 
                bg-neutral-700/70 text-gray-300 
                hover:bg-neutral-600/70 transition text-base sm:text-lg"
            >
              {backButtonText}
            </button>
          )}
          <button
            onClick={handleNext}
            aria-label={isLastStep ? "Finalizar formulario" : "Avanzar al siguiente paso"}
            className="w-full sm:w-auto ml-auto px-5 py-3 rounded-lg 
              bg-indigo-600 text-white 
              hover:bg-indigo-700 transition text-base sm:text-lg"
          >
            {isLastStep ? "Finalizar" : nextButtonText}
          </button>
        </div>
      )}
    </div>
  )
}

interface StepContentWrapperProps {
  isCompleted: boolean
  currentStep: number
  direction: number
  children: ReactNode
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
}: StepContentWrapperProps) {
  return (
    <motion.div
      className="w-full"
      style={{ position: "relative", minHeight: "220px" }}
    >
      <AnimatePresence initial={false} custom={direction}>
        {!isCompleted && (
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-40%" : "40%", opacity: 0 }),
}

export function Step({ children }: StepProps) {
  return <div className="text-center p-4 sm:p-6 text-base sm:text-lg">{children}</div>
}
