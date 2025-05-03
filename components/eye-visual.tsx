"use client"

import { useEffect, useRef } from "react"

interface EyeVisualProps {
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
}

export default function EyeVisual({ eye, trialLens, jccLens }: EyeVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with fixed aspect ratio to prevent warping
    const containerWidth = canvas.clientWidth
    const containerHeight = canvas.clientHeight

    // Use a 1:1 aspect ratio
    const size = Math.min(containerWidth, containerHeight)
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const eyeRadius = Math.min(centerX, centerY) * 0.5

    // Draw eye
    drawEye(ctx, centerX, centerY, eyeRadius, eye)

    // Draw trial lens
    drawTrialLens(ctx, centerX, centerY, eyeRadius * 1.2, trialLens)

    // Draw JCC lens
    drawJCCLens(ctx, centerX, centerY, eyeRadius * 1.3, trialLens, jccLens)
  }, [eye, trialLens, jccLens])

  const drawEye = (ctx, centerX, centerY, radius, eye) => {
    // Draw sclera (white of eye)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = "#f8f8f8"
    ctx.fill()
    ctx.strokeStyle = "#aaa"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw iris
    const irisRadius = radius * 0.6
    ctx.beginPath()
    ctx.arc(centerX, centerY, irisRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#2a7e19" // Green iris like in the image
    ctx.fill()

    // Add iris texture
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * irisRadius * 0.8
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      const length = Math.random() * 5 + 2

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3 + 0.1})`
      ctx.lineWidth = Math.random() * 1 + 0.5
      ctx.stroke()
    }

    // Draw pupil
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = "#000"
    ctx.fill()

    // Draw light reflection
    ctx.beginPath()
    ctx.arc(centerX + radius * 0.15, centerY - radius * 0.15, radius * 0.08, 0, Math.PI * 2)
    ctx.fillStyle = "#fff"
    ctx.fill()

    // Label the eye
    ctx.font = "16px sans-serif"
    ctx.fillStyle = "#0ea5e9" // Sky blue for text
    ctx.textAlign = "center"
    ctx.fillText(eye, centerX, centerY + radius * 1.8)
  }

  const drawTrialLens = (ctx, centerX, centerY, radius, trialLens) => {
    // Draw trial lens circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])
    ctx.stroke()
    ctx.setLineDash([])

    // Draw cylinder axis line
    const axisRadian = (trialLens.axis * Math.PI) / 180
    ctx.beginPath()
    ctx.moveTo(centerX - Math.cos(axisRadian) * radius * 1.1, centerY - Math.sin(axisRadian) * radius * 1.1)
    ctx.lineTo(centerX + Math.cos(axisRadian) * radius * 1.1, centerY + Math.sin(axisRadian) * radius * 1.1)
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw axis value
    const axisTextX = centerX + Math.cos(axisRadian) * radius * 1.2
    const axisTextY = centerY + Math.sin(axisRadian) * radius * 1.2
    ctx.font = "bold 14px sans-serif"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${trialLens.axis}°`, axisTextX, axisTextY)
  }

  const drawJCCLens = (ctx, centerX, centerY, radius, trialLens, jccLens) => {
    if (jccLens.isFlipping) {
      // If flipping, draw a transitional state
      ctx.globalAlpha = 0.5
    }

    // Calculate JCC orientation based on position and active side
    let jccRadian
    if (jccLens.position === "axis") {
      // For axis refinement, JCC straddles the cylinder axis (±45°)
      const jccOrientation = jccLens.activeSide === "red" ? trialLens.axis + 45 : trialLens.axis - 45
      jccRadian = (jccOrientation * Math.PI) / 180
    } else {
      // For power refinement, JCC aligns with cylinder axis
      jccRadian = (trialLens.axis * Math.PI) / 180
    }

    // Draw JCC lens circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "#e11d48" // Red for JCC
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw JCC handle (45 degrees to the lens)
    const handleAngle = jccRadian + Math.PI / 4
    const handleLength = radius * 0.8
    const handleWidth = radius * 0.1

    // Draw handle
    ctx.beginPath()
    ctx.moveTo(centerX + Math.cos(handleAngle) * radius, centerY + Math.sin(handleAngle) * radius)
    ctx.lineTo(
      centerX + Math.cos(handleAngle) * (radius + handleLength),
      centerY + Math.sin(handleAngle) * (radius + handleLength),
    )
    ctx.strokeStyle = "#000"
    ctx.lineWidth = handleWidth
    ctx.stroke()

    // Draw the JCC lens divided into two halves
    const perpRadian = jccRadian + Math.PI / 2

    // Draw the dividing line
    ctx.beginPath()
    ctx.moveTo(centerX - Math.cos(perpRadian) * radius, centerY - Math.sin(perpRadian) * radius)
    ctx.lineTo(centerX + Math.cos(perpRadian) * radius, centerY + Math.sin(perpRadian) * radius)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw small indicator lines at the edges instead of a full cross
    const lineLength = radius * 0.15

    // Red side indicator
    ctx.beginPath()
    ctx.moveTo(
      centerX + Math.cos(jccRadian) * (radius - lineLength),
      centerY + Math.sin(jccRadian) * (radius - lineLength),
    )
    ctx.lineTo(centerX + Math.cos(jccRadian) * radius, centerY + Math.sin(jccRadian) * radius)
    ctx.strokeStyle = "#e11d48" // Red
    ctx.lineWidth = 3
    ctx.stroke()

    // Green/Black side indicator
    ctx.beginPath()
    ctx.moveTo(
      centerX - Math.cos(jccRadian) * (radius - lineLength),
      centerY - Math.sin(jccRadian) * (radius - lineLength),
    )
    ctx.lineTo(centerX - Math.cos(jccRadian) * radius, centerY - Math.sin(jccRadian) * radius)
    ctx.strokeStyle = "#2a7e19" // Green
    ctx.lineWidth = 3
    ctx.stroke()

    // Add power indicators like in the image
    const positivePowerX = centerX - Math.cos(jccRadian) * (radius * 0.7)
    const positivePowerY = centerY - Math.sin(jccRadian) * (radius * 0.7)
    const negativePowerX = centerX + Math.cos(jccRadian) * (radius * 0.7)
    const negativePowerY = centerY + Math.sin(jccRadian) * (radius * 0.7)

    // Draw power indicator backgrounds
    // Positive power (+0.25)
    ctx.fillStyle = "#2a7e19" // Green
    ctx.fillRect(positivePowerX - 30, positivePowerY - 15, 60, 30)

    // Negative power (-0.25)
    ctx.fillStyle = "#e11d48" // Red
    ctx.fillRect(negativePowerX - 30, negativePowerY - 15, 60, 30)

    // Draw power text
    ctx.font = "bold 14px sans-serif"
    ctx.fillStyle = "#fff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`+${jccLens.power}`, positivePowerX, positivePowerY)
    ctx.fillText(`-${jccLens.power}`, negativePowerX, negativePowerY)

    // Highlight active side
    if (jccLens.activeSide === "red") {
      ctx.beginPath()
      ctx.arc(negativePowerX, negativePowerY, 10, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.arc(positivePowerX, positivePowerY, 10, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.fill()
    }

    // Reset alpha if we were flipping
    if (jccLens.isFlipping) {
      ctx.globalAlpha = 1.0
    }

    // Visual representation of lens power
    const sphereText = `Sphere: ${trialLens.sphere.toFixed(2)}`
    const cylinderText = `Cylinder: ${trialLens.cylinder.toFixed(2)}`
    const axisText = `Axis: ${trialLens.axis}°`

    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    ctx.fillText(sphereText, centerX, centerY - radius * 1.8)
    ctx.fillText(cylinderText, centerX, centerY - radius * 1.6)
    ctx.fillText(axisText, centerX, centerY - radius * 1.4)

    // Add JCC position information
    const jccText = `JCC: ${jccLens.position === "axis" ? "Axis Refinement" : "Power Refinement"}`
    ctx.fillText(jccText, centerX, centerY + radius * 1.6)
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="border border-sky-200 rounded-lg shadow-sm"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  )
}
