"use client"

import { motion } from "framer-motion"

interface IntegratedEyeVisualProps {
  eye: string
  trialLens: {
    sphere: number
    cylinder: number
    axis: number
  }
  jccLens: {
    power: number
    orientation: number
    position: string
    activeSide?: string
    isFlipping?: boolean
  }
  visualAcuity: string
  patientRx?: {
    sphere: number
    cylinder: number
    axis: number
  }
}

export default function IntegratedEyeVisual({
  eye,
  trialLens,
  jccLens,
  visualAcuity,
  patientRx,
}: IntegratedEyeVisualProps) {
  // Convert degrees to radians for calculations
  const axisRadians = (trialLens.axis * Math.PI) / 180

  // Determine colors based on active side - when flipped, red becomes green and vice versa
  const redDotColor = jccLens.activeSide === "red" ? "#ef4444" : "#22c55e"
  const greenDotColor = jccLens.activeSide === "red" ? "#22c55e" : "#ef4444"
  const redDotLabel = jccLens.activeSide === "red" ? "+" : "-"
  const greenDotLabel = jccLens.activeSide === "red" ? "-" : "+"

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      {/* Visual Acuity Display */}
      <div className="mb-4 bg-sky-50 px-6 py-2 rounded-full border border-sky-200">
        <span className="text-xl font-bold text-sky-700">VA: {visualAcuity}</span>
      </div>

      {/* Main SVG Container */}
      <div className="relative w-full max-w-md aspect-square">
        <motion.svg
          viewBox="0 0 300 300"
          className="w-full h-full"
          style={{ filter: `drop-shadow(0px 2px 4px rgba(0,0,0,0.1))` }}
        >
          {/* Background */}
          <rect x="0" y="0" width="300" height="300" fill="white" rx="8" />

          {/* Eye */}
          <g>
            {/* Sclera (white of eye) */}
            <circle cx="150" cy="150" r="70" fill="white" stroke="#d1d5db" strokeWidth="2" />

            {/* Iris */}
            <circle cx="150" cy="150" r="40" fill="#3b82f6" />

            {/* Pupil */}
            <circle cx="150" cy="150" r="20" fill="black" />

            {/* Light reflection */}
            <circle cx="160" cy="140" r="8" fill="white" />
          </g>

          {/* Cylinder Axis Line (green dotted) */}
          <line
            x1={150 - Math.cos(axisRadians) * 120}
            y1={150 - Math.sin(axisRadians) * 120}
            x2={150 + Math.cos(axisRadians) * 120}
            y2={150 + Math.sin(axisRadians) * 120}
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="5,3"
          />

          {/* JCC Circle */}
          <circle cx="150" cy="150" r="120" fill="none" stroke="#64748b" strokeWidth="2" />

          {/* JCC Group - rotates as a unit */}
          <motion.g
            initial={false}
            animate={{
              rotate: jccLens.orientation,
              opacity: jccLens.isFlipping ? 0.5 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              duration: 0.3,
            }}
            style={{ transformOrigin: "150px 150px" }}
          >
            {/* JCC Dividing Lines */}
            <line x1="30" y1="150" x2="270" y2="150" stroke="#64748b" strokeWidth="1" />
            <line x1="150" y1="30" x2="150" y2="270" stroke="#64748b" strokeWidth="1" />

            {/* Red Dots - positioned opposite each other (top and bottom) */}
            <circle cx="150" cy="30" r="10" fill={redDotColor} stroke="white" strokeWidth="2" />
            <circle cx="150" cy="270" r="10" fill={redDotColor} stroke="white" strokeWidth="2" />

            {/* Green Dots - positioned opposite each other (left and right) */}
            <circle cx="30" cy="150" r="10" fill={greenDotColor} stroke="white" strokeWidth="2" />
            <circle cx="270" cy="150" r="10" fill={greenDotColor} stroke="white" strokeWidth="2" />

            {/* JCC Handle - now attached to the edge at 45 degrees from dots */}
            <line x1="210" y1="90" x2="250" y2="50" stroke="#333333" strokeWidth="8" strokeLinecap="round" />

            {/* Power Indicators */}
            <text
              x="150"
              y="15"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {redDotLabel}
              {jccLens.power}
            </text>

            <text
              x="150"
              y="285"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {redDotLabel}
              {jccLens.power}
            </text>

            <text
              x="15"
              y="150"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {greenDotLabel}
              {jccLens.power}
            </text>

            <text
              x="285"
              y="150"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {greenDotLabel}
              {jccLens.power}
            </text>
          </motion.g>

          {/* Eye Label */}
          <text x="150" y="250" fill="#0ea5e9" fontSize="16" fontWeight="bold" textAnchor="middle">
            {eye}
          </text>
        </motion.svg>
      </div>

      {/* Prescription Info */}
      <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-md">
        <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-center">
          <div className="text-xs text-sky-400 uppercase font-semibold">Sphere</div>
          <div className="text-lg font-bold text-sky-600">{trialLens.sphere.toFixed(2)}D</div>
        </div>

        <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-center">
          <div className="text-xs text-sky-400 uppercase font-semibold">Cylinder</div>
          <div className="text-lg font-bold text-sky-600">{trialLens.cylinder.toFixed(2)}D</div>
        </div>

        <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-center">
          <div className="text-xs text-sky-400 uppercase font-semibold">Axis</div>
          <div className="text-lg font-bold text-sky-600">{trialLens.axis}°</div>
        </div>
      </div>

      {/* JCC Info */}
      <div className="mt-4 flex justify-between w-full max-w-md">
        <div className="bg-sky-50 px-4 py-2 rounded-lg border border-sky-100">
          <span className="font-medium text-sky-700">
            {jccLens.position === "axis" ? "Axis Refinement" : "Power Refinement"}
          </span>
        </div>

        <div
          className={`px-4 py-2 rounded-lg border ${
            jccLens.activeSide === "red"
              ? "bg-red-50 border-red-100 text-red-600"
              : "bg-green-50 border-green-100 text-green-600"
          }`}
        >
          <span className="font-medium">Active: {jccLens.activeSide === "red" ? "Red Side" : "Green Side"}</span>
        </div>
      </div>
    </div>
  )
}
