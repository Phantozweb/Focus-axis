/**
 * JCC Simulator Core Logic
 * This file contains the core logic for the JCC simulator, including
 * prescription generation, patient response simulation, and utility functions.
 */

// Types
export interface Prescription {
  sphere: number
  cylinder: number
  axis: number
}

export interface JccState {
  mode: "AxisRefinement" | "PowerRefinement"
  power: number
  activePreference: "Red" | "Green" | "Equal" | "None"
}

// Constants
const AXIS_ENDPOINT_THRESHOLD = 3 // degrees
const MIN_SPHERE = -6.0
const MAX_SPHERE = 4.0
const MIN_CYLINDER = -3.0
const MAX_CYLINDER = 0.0
const MIN_AXIS = 1
const MAX_AXIS = 180

/**
 * Generates a random prescription within realistic ranges
 */
export function generateRandomPrescription(): Prescription {
  // Generate random sphere between MIN_SPHERE and MAX_SPHERE in 0.25 steps
  const sphere = Math.round((Math.random() * (MAX_SPHERE - MIN_SPHERE) + MIN_SPHERE) * 4) / 4

  // Generate random cylinder between MIN_CYLINDER and MAX_CYLINDER in 0.25 steps
  const cylinder = Math.round((Math.random() * (MAX_CYLINDER - MIN_CYLINDER) + MIN_CYLINDER) * 4) / 4

  // Generate random axis between MIN_AXIS and MAX_AXIS
  const axis = Math.floor(Math.random() * (MAX_AXIS - MIN_AXIS + 1)) + MIN_AXIS

  return {
    sphere,
    cylinder,
    axis,
  }
}

/**
 * Generates a slightly incorrect initial trial lens based on the hidden prescription
 */
export function generateInitialTrialLens(hiddenPrescription: Prescription): Prescription {
  // Add small random errors to each component
  const sphereError = Math.random() > 0.5 ? 0.5 : -0.5
  const cylinderError = Math.random() > 0.5 ? 0.25 : -0.25
  const axisError = Math.random() > 0.5 ? 10 : -10

  return {
    sphere: Math.round((hiddenPrescription.sphere + sphereError) * 4) / 4,
    cylinder: Math.round((hiddenPrescription.cylinder + cylinderError) * 4) / 4,
    axis: Math.min(MAX_AXIS, Math.max(MIN_AXIS, hiddenPrescription.axis + axisError)),
  }
}

/**
 * Calculates the shortest angle difference between two axes (1-180)
 */
export function shortestAngleDifference(axis1: number, axis2: number): number {
  const diff = Math.abs(axis1 - axis2)
  return Math.min(diff, 180 - diff)
}

/**
 * Determines if trialAxis needs to rotate Clockwise (CW) or Counter-Clockwise (CCW)
 * to reach hiddenAxis via the shortest path
 */
export function getAxisRotationDirection(trialAxis: number, hiddenAxis: number): "CW" | "CCW" | "None" {
  if (trialAxis === hiddenAxis) return "None"

  // Calculate the difference and determine the shortest path
  let diff = hiddenAxis - trialAxis

  // Handle the wrap-around cases
  if (diff > 90) diff -= 180
  if (diff < -90) diff += 180

  if (diff === 0) return "None"
  return diff > 0 ? "CW" : "CCW"
}

/**
 * Calculates the visual acuity based on the current error
 */
export function calculateVisualAcuity(trialLens: Prescription, hiddenPrescription: Prescription): string {
  // Calculate spherical equivalent error
  const trialSE = trialLens.sphere + trialLens.cylinder / 2
  const hiddenSE = hiddenPrescription.sphere + hiddenPrescription.cylinder / 2
  const seError = Math.abs(trialSE - hiddenSE)

  // Calculate cylinder magnitude error
  const cylMagError = Math.abs(trialLens.cylinder - hiddenPrescription.cylinder)

  // Calculate axis error (weighted by cylinder magnitude)
  const axisError = shortestAngleDifference(trialLens.axis, hiddenPrescription.axis)
  const weightedAxisError =
    Math.abs(hiddenPrescription.cylinder) > 0.5 ? (axisError / 90) * Math.abs(hiddenPrescription.cylinder) : 0

  // Calculate total error
  const totalError = seError + cylMagError / 2 + weightedAxisError

  // Map total error to visual acuity
  if (totalError < 0.25) return "6/6"
  if (totalError < 0.5) return "6/9"
  if (totalError < 0.75) return "6/12"
  if (totalError < 1.0) return "6/18"
  if (totalError < 1.5) return "6/24"
  if (totalError < 2.0) return "6/36"
  return "6/60"
}

/**
 * Calculates the spherical equivalent of a prescription
 */
export function calculateSphericalEquivalent(prescription: Prescription): number {
  return prescription.sphere + prescription.cylinder / 2
}

/**
 * Determines the patient's preference based on the current trial lens and hidden prescription
 */
export function determinePatientPreference(
  trialLens: Prescription,
  hiddenPrescription: Prescription,
  jccState: JccState,
  inconsistencyFactor = 0.15, // Probability of giving inconsistent response
): "Red" | "Green" | "Equal" | "Unreliable" {
  // Add randomness to simulate patient inconsistency
  const isInconsistent = Math.random() < inconsistencyFactor

  // Power refinement endpoint threshold depends on JCC power
  const powerEndpointThreshold = jccState.power / 2

  if (jccState.mode === "AxisRefinement") {
    // Calculate axis error
    const axisError = shortestAngleDifference(trialLens.axis, hiddenPrescription.axis)

    // Check if we've reached the endpoint
    if (axisError <= AXIS_ENDPOINT_THRESHOLD) {
      return "Equal"
    }

    // Determine rotation needed
    const direction = getAxisRotationDirection(trialLens.axis, hiddenPrescription.axis)

    // Map rotation to JCC preference
    let preference: "Red" | "Green"

    if (direction === "None") {
      return "Equal"
    } else if (direction === "CW") {
      // For minus cylinder, if we need to rotate CW, patient prefers Red
      preference = "Red"
    } else {
      // For minus cylinder, if we need to rotate CCW, patient prefers Green
      preference = "Green"
    }

    // Return inconsistent response if applicable
    return isInconsistent ? (preference === "Red" ? "Green" : "Red") : preference
  } else if (jccState.mode === "PowerRefinement") {
    // Calculate power difference
    const powerDifference = hiddenPrescription.cylinder - trialLens.cylinder

    // Check axis error - if too large, power refinement is unreliable
    const axisError = shortestAngleDifference(trialLens.axis, hiddenPrescription.axis)
    if (axisError > 20) {
      return "Unreliable"
    }

    // Check if we've reached the endpoint
    if (Math.abs(powerDifference) < powerEndpointThreshold) {
      return "Equal"
    }

    // Determine preference
    let preference: "Red" | "Green"

    if (powerDifference < 0) {
      // Hidden is more minus, patient needs more minus cylinder
      preference = "Green"
    } else {
      // Hidden is less minus, patient needs less minus cylinder
      preference = "Red"
    }

    // Return inconsistent response if applicable
    return isInconsistent ? (preference === "Red" ? "Green" : "Red") : preference
  }

  return "None"
}

/**
 * Calculates the remaining error between trial lens and hidden prescription
 */
export function calculateError(trialLens: Prescription, hiddenPrescription: Prescription) {
  // Calculate spherical equivalent
  const trialSE = calculateSphericalEquivalent(trialLens)
  const hiddenSE = calculateSphericalEquivalent(hiddenPrescription)

  // Calculate axis error (accounting for circular nature of axis)
  const axisDiff = shortestAngleDifference(trialLens.axis, hiddenPrescription.axis)

  return {
    sphere: (trialLens.sphere - hiddenPrescription.sphere).toFixed(2),
    cylinder: (trialLens.cylinder - hiddenPrescription.cylinder).toFixed(2),
    axis: axisDiff,
    sphericalEquivalent: (trialSE - hiddenSE).toFixed(2),
  }
}

/**
 * Generates patient feedback based on the current JCC state and preference
 */
export function generatePatientFeedback(
  jccState: JccState,
  preference: "Red" | "Green" | "Equal" | "Unreliable" | "None",
): string {
  if (preference === "None") {
    return "Please flip the JCC lens and ask for feedback."
  }

  if (preference === "Unreliable") {
    return "The patient's responses seem inconsistent. Consider refining the axis first."
  }

  if (preference === "Equal") {
    return "Both sides look equally blurry. You've reached the endpoint for this component."
  }

  if (jccState.mode === "AxisRefinement") {
    return `This side appears CLEARER. Rotate axis toward the ${preference} dot.`
  } else {
    if (preference === "Red") {
      return "This side appears CLEARER. Reduce minus cylinder by 0.25D and add +0.25D to sphere."
    } else {
      return "This side appears CLEARER. Increase minus cylinder by 0.25D and subtract 0.25D from sphere."
    }
  }
}

/**
 * Calculates the accuracy of the refraction compared to the hidden prescription
 */
export function calculateAccuracy(trialLens: Prescription, hiddenPrescription: Prescription) {
  // Calculate sphere accuracy (within 0.25D is considered 100%)
  const sphereDiff = Math.abs(trialLens.sphere - hiddenPrescription.sphere)
  const sphereAccuracy = Math.max(0, 100 - (sphereDiff / 0.25) * 25)

  // Calculate cylinder accuracy (within 0.25D is considered 100%)
  const cylinderDiff = Math.abs(trialLens.cylinder - hiddenPrescription.cylinder)
  const cylinderAccuracy = Math.max(0, 100 - (cylinderDiff / 0.25) * 25)

  // Calculate axis accuracy (within 5 degrees is considered 100%)
  const axisDiff = shortestAngleDifference(trialLens.axis, hiddenPrescription.axis)
  // Weight axis accuracy by cylinder magnitude
  const axisWeight = Math.min(1, Math.abs(hiddenPrescription.cylinder) / 0.75)
  const axisAccuracy = Math.max(0, 100 - (axisDiff / 5) * 20) * axisWeight

  // Calculate overall accuracy (weighted average)
  const overallAccuracy = sphereAccuracy * 0.4 + cylinderAccuracy * 0.4 + axisAccuracy * 0.2

  return {
    sphere: Math.round(sphereAccuracy),
    cylinder: Math.round(cylinderAccuracy),
    axis: Math.round(axisAccuracy),
    overall: Math.round(overallAccuracy),
  }
}

/**
 * Determines if the JCC is properly aligned for the current mode
 */
export function isJccProperlyAligned(
  trialLens: Prescription,
  jccOrientation: number,
  mode: "AxisRefinement" | "PowerRefinement",
): boolean {
  const cylinderAxis = trialLens.axis
  let targetOrientation: number

  if (mode === "AxisRefinement") {
    // For axis refinement, JCC should be at 45° to cylinder axis
    targetOrientation = (cylinderAxis + 45) % 180
  } else {
    // For power refinement, JCC should align with cylinder axis
    targetOrientation = cylinderAxis
  }

  // Check if current orientation is close to target (within 2 degrees)
  const orientationDiff = shortestAngleDifference(jccOrientation, targetOrientation)
  return orientationDiff < 2
}

/**
 * Sets the JCC orientation for the current refinement mode
 */
export function getProperJccOrientation(cylinderAxis: number, mode: "AxisRefinement" | "PowerRefinement"): number {
  if (mode === "AxisRefinement") {
    // For axis refinement, JCC should be at 45° to cylinder axis
    return (cylinderAxis + 45) % 180
  } else {
    // For power refinement, JCC should align with cylinder axis
    return cylinderAxis
  }
}

/**
 * Format time for display (MM:SS)
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

/**
 * Convert 6/x format to 20/y format (metric to imperial VA)
 */
export function convertToImperialVA(metricVA: string): string {
  const parts = metricVA.split("/")
  if (parts.length !== 2) return metricVA

  const numerator = Math.round((Number.parseInt(parts[0]) / 6) * 20)
  const denominator = Math.round((Number.parseInt(parts[1]) / 6) * 20)

  return `20/${denominator}`
}

/**
 * Convert 20/x format to 6/y format (imperial to metric VA)
 */
export function convertToMetricVA(imperialVA: string): string {
  const parts = imperialVA.split("/")
  if (parts.length !== 2) return imperialVA

  const numerator = Math.round((Number.parseInt(parts[0]) / 20) * 6)
  const denominator = Math.round((Number.parseInt(parts[1]) / 20) * 6)

  return `${numerator}/${denominator}`
}

/**
 * Format prescription for display
 */
export function formatPrescription(prescription: { sphere: number; cylinder: number; axis: number }): string {
  return `${prescription.sphere.toFixed(2)} / ${prescription.cylinder.toFixed(2)} x ${prescription.axis}°`
}

/**
 * Generate a clinical interpretation of the prescription
 */
export function interpretPrescription(prescription: { sphere: number; cylinder: number; axis: number }): string {
  const se = prescription.sphere + prescription.cylinder / 2

  let interpretation = ""

  // Interpret spherical equivalent
  if (se > 0.5) {
    interpretation += "Hyperopic "
  } else if (se < -0.5) {
    interpretation += "Myopic "
  } else {
    interpretation += "Emmetropic "
  }

  // Interpret astigmatism
  if (Math.abs(prescription.cylinder) >= 0.75) {
    interpretation += "with significant astigmatism"

    // Interpret axis
    if ((prescription.axis >= 0 && prescription.axis <= 30) || (prescription.axis >= 150 && prescription.axis <= 180)) {
      interpretation += " (with-the-rule)"
    } else if (prescription.axis >= 60 && prescription.axis <= 120) {
      interpretation += " (against-the-rule)"
    } else {
      interpretation += " (oblique)"
    }
  } else if (Math.abs(prescription.cylinder) >= 0.25) {
    interpretation += "with mild astigmatism"
  } else {
    interpretation += "with minimal/no astigmatism"
  }

  return interpretation
}
