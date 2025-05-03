/**
 * JCC Utility functions
 */

// Types
export interface Prescription {
  sphere: number
  cylinder: number
  axis: number
}

/**
 * Generates a random prescription within realistic ranges
 */
export function generateRandomPrescription(): Prescription {
  // Generate random sphere between -6.0 and +4.0 in 0.25 steps
  const sphere = Math.round(Math.random() * 40 - 24) / 4

  // Generate random cylinder between 0.0 and -3.0 in 0.25 steps
  const cylinder = Math.round(Math.random() * 12) / -4

  // Generate random axis between 1 and 180
  const axis = Math.floor(Math.random() * 180) + 1

  return {
    sphere,
    cylinder,
    axis,
  }
}
