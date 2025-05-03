"use client"

import { motion } from "framer-motion"

interface JCCLensProps {
  orientation: number
  stage: string
  power?: number
  activeSide?: string
  isFlipping?: boolean
}

export default function JCCLens({
  orientation,
  stage,
  power = 0.25,
  activeSide = "red",
  isFlipping = false,
}: JCCLensProps) {
  // Calculate JCC orientation based on stage
  const getJccOrientation = () => {
    if (stage === "axis") {
      // For axis refinement, JCC handle aligns with cylinder axis
      return orientation
    } else {
      // For power refinement, JCC is rotated 45° from cylinder axis
      return (orientation + 45) % 180
    }
  }

  const jccOrientation = getJccOrientation()

  // Determine colors based on active side
  const redDotColor = activeSide === "red" ? "#ef4444" : "#22c55e"
  const greenDotColor = activeSide === "red" ? "#22c55e" : "#ef4444"
  const redDotLabel = activeSide === "red" ? "+" : "-"
  const greenDotLabel = activeSide === "red" ? "-" : "+"

  return (
    <div className="relative w-full aspect-square max-w-[200px] mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-lg font-bold text-sky-700">{activeSide === "red" ? "Red Side" : "Green Side"}</div>
      </div>

      <motion.div
        className="w-full h-full"
        animate={{
          rotateY: isFlipping ? 180 : 0,
          opacity: isFlipping ? 0.5 : 1,
        }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Outer circle */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="#64748b" strokeWidth="2" />

          {/* JCC lens */}
          <g transform={`rotate(${jccOrientation} 100 100)`}>
            {/* Dividing lines */}
            <line x1="10" y1="100" x2="190" y2="100" stroke="#64748b" strokeWidth="1" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="#64748b" strokeWidth="1" />

            {/* Red dots - top and bottom */}
            <circle cx="100" cy="10" r="8" fill={redDotColor} stroke="white" strokeWidth="1" />
            <circle cx="100" cy="190" r="8" fill={redDotColor} stroke="white" strokeWidth="1" />

            {/* Green dots - left and right */}
            <circle cx="10" cy="100" r="8" fill={greenDotColor} stroke="white" strokeWidth="1" />
            <circle cx="190" cy="100" r="8" fill={greenDotColor} stroke="white" strokeWidth="1" />

            {/* Handle attached to edge at 45 degrees from dots */}
            <line x1="140" y1="60" x2="170" y2="30" stroke="#333333" strokeWidth="6" strokeLinecap="round" />

            {/* Power labels */}
            <text x="100" y="5" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
              {redDotLabel}
              {power}
            </text>
            <text x="100" y="195" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
              {redDotLabel}
              {power}
            </text>
            <text
              x="5"
              y="100"
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
              dominantBaseline="middle"
            >
              {greenDotLabel}
              {power}
            </text>
            <text
              x="195"
              y="100"
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
              dominantBaseline="middle"
            >
              {greenDotLabel}
              {power}
            </text>
          </g>

          {/* Power label */}
          <text x="100" y="195" textAnchor="middle" fill="#64748b" fontSize="12">
            ±{power}D
          </text>
        </svg>
      </motion.div>
    </div>
  )
}
