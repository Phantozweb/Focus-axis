"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Eye, RefreshCw } from "lucide-react"
import Link from "next/link"
import JCCLens from "@/components/jcc-lens"
import VAChart from "@/components/va-chart"
import { generateRandomPrescription } from "@/lib/jcc-utils"

// Stages of JCC procedure
const STAGES = {
  CASE_GENERATION: "case_generation",
  AXIS_REFINEMENT: "axis_refinement",
  AXIS_CONFIRMATION: "axis_confirmation",
  POWER_REFINEMENT: "power_refinement",
  POWER_CONFIRMATION: "power_confirmation",
  RESULTS: "results",
}

export default function PracticePage() {
  const router = useRouter()
  const [stage, setStage] = useState(STAGES.CASE_GENERATION)
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // True prescription (hidden from user)
  const [truePrescription, setTruePrescription] = useState({
    sphere: 0,
    cylinder: 0,
    axis: 0,
  })

  // Current prescription (what the user is working with)
  const [currentPrescription, setCurrentPrescription] = useState({
    sphere: 0,
    cylinder: 0,
    axis: 0,
  })

  // JCC state
  const [jccOrientation, setJccOrientation] = useState(0)
  const [activeLens, setActiveLens] = useState(null)
  const [jccPower, setJccPower] = useState(0.25)

  // Results
  const [accuracy, setAccuracy] = useState({
    sphere: 0,
    cylinder: 0,
    axis: 0,
    overall: 0,
  })

  // Eye being tested
  const [eye, setEye] = useState("OD") // OD = right eye, OS = left eye

  // Initialize practice session
  useEffect(() => {
    if (stage === STAGES.CASE_GENERATION) {
      const trueRx = generateRandomPrescription()
      setTruePrescription(trueRx)

      // Create starting prescription with slight errors
      const startingRx = {
        sphere: trueRx.sphere + (Math.random() > 0.5 ? 0.25 : -0.25),
        cylinder: trueRx.cylinder + (Math.random() > 0.5 ? 0.25 : -0.25),
        axis: Math.min(180, Math.max(1, trueRx.axis + (Math.random() > 0.5 ? 10 : -10))),
      }

      setCurrentPrescription(startingRx)
      setStage(STAGES.AXIS_REFINEMENT)
      setTimerActive(true)

      // Randomly select eye if not already set
      if (Math.random() > 0.5) {
        setEye("OS")
      } else {
        setEye("OD")
      }
    }
  }, [stage])

  // Timer
  useEffect(() => {
    let interval
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timerActive])

  // Update progress based on stage
  useEffect(() => {
    switch (stage) {
      case STAGES.CASE_GENERATION:
        setProgress(0)
        break
      case STAGES.AXIS_REFINEMENT:
        setProgress(20)
        break
      case STAGES.AXIS_CONFIRMATION:
        setProgress(40)
        break
      case STAGES.POWER_REFINEMENT:
        setProgress(60)
        break
      case STAGES.POWER_CONFIRMATION:
        setProgress(80)
        break
      case STAGES.RESULTS:
        setProgress(100)
        setTimerActive(false)
        calculateAccuracy()
        break
    }
  }, [stage])

  // Calculate accuracy compared to true prescription
  const calculateAccuracy = () => {
    const sphereAccuracy = 100 - Math.abs(truePrescription.sphere - currentPrescription.sphere) * 100
    const cylinderAccuracy = 100 - Math.abs(truePrescription.cylinder - currentPrescription.cylinder) * 100

    // Axis accuracy is more complex due to circular nature
    let axisDiff = Math.abs(truePrescription.axis - currentPrescription.axis)
    if (axisDiff > 90) axisDiff = 180 - axisDiff
    const axisAccuracy = 100 - (axisDiff / 90) * 100

    const overallAccuracy = (sphereAccuracy + cylinderAccuracy + axisAccuracy) / 3

    setAccuracy({
      sphere: Math.max(0, Math.min(100, sphereAccuracy)),
      cylinder: Math.max(0, Math.min(100, cylinderAccuracy)),
      axis: Math.max(0, Math.min(100, axisAccuracy)),
      overall: Math.max(0, Math.min(100, overallAccuracy)),
    })
  }

  // Handle lens selection during JCC testing
  const handleLensSelection = (lensNumber) => {
    if (stage === STAGES.AXIS_REFINEMENT) {
      // Adjust axis based on lens selection
      // Add some randomness to the direction and amount of adjustment
      const axisDirection = Math.random() > 0.3 ? 1 : -1 // Mostly correct but sometimes wrong direction
      const axisAmount = Math.floor(Math.random() * 8) + 2 // Random amount between 2-10 degrees

      // Calculate the actual axis change based on lens selection
      const axisChange = lensNumber === 1 ? axisDirection * axisAmount : -axisDirection * axisAmount

      setCurrentPrescription((prev) => ({
        ...prev,
        axis: (prev.axis + axisChange + 180) % 180 || 180, // Keep axis between 1-180
      }))

      // After a few refinements, move to confirmation
      if (Math.random() > 0.7) {
        setStage(STAGES.AXIS_CONFIRMATION)
      }
    } else if (stage === STAGES.AXIS_CONFIRMATION) {
      // If lens preference is consistent, move to power refinement
      setStage(STAGES.POWER_REFINEMENT)
    } else if (stage === STAGES.POWER_REFINEMENT) {
      // Adjust cylinder power based on lens selection
      // If lens 1 (red) is preferred, reduce minus cylinder
      // If lens 2 (green) is preferred, increase minus cylinder
      const powerChange = lensNumber === 1 ? 0.25 : -0.25 // Positive for red, negative for green

      setCurrentPrescription((prev) => ({
        ...prev,
        // For red (lens 1): Add to cylinder (less minus)
        // For green (lens 2): Subtract from cylinder (more minus)
        cylinder: prev.cylinder + powerChange,
        // Adjust sphere to maintain spherical equivalent
        // Add the negative of half the cylinder change
        sphere: prev.sphere - powerChange / 2,
      }))

      // After a few refinements, move to confirmation
      if (Math.random() > 0.7) {
        setStage(STAGES.POWER_CONFIRMATION)
      }
    } else if (stage === STAGES.POWER_CONFIRMATION) {
      // If lens preference is consistent, move to results
      setStage(STAGES.RESULTS)
    }
  }

  // Handle "both same" selection
  const handleBothSame = () => {
    if (stage === STAGES.AXIS_REFINEMENT) {
      setStage(STAGES.AXIS_CONFIRMATION)
    } else if (stage === STAGES.AXIS_CONFIRMATION) {
      setStage(STAGES.POWER_REFINEMENT)
    } else if (stage === STAGES.POWER_REFINEMENT) {
      setStage(STAGES.POWER_CONFIRMATION)
    } else if (stage === STAGES.POWER_CONFIRMATION) {
      setStage(STAGES.RESULTS)
    }
  }

  // Restart practice with new case
  const handleRestart = () => {
    setStage(STAGES.CASE_GENERATION)
    setTimeElapsed(0)
  }

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Focus.JCC</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Time: {formatTime(timeElapsed)}</div>
            <Link href="/setup">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-4 px-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Axis Refinement</span>
          <span>Power Refinement</span>
          <span>Results</span>
        </div>
      </div>

      <main className="flex-1 container mx-auto py-4 px-4">
        {stage === STAGES.AXIS_REFINEMENT || stage === STAGES.AXIS_CONFIRMATION ? (
          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2">
                  {stage === STAGES.AXIS_REFINEMENT ? "Axis Refinement" : "Axis Confirmation"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {eye} • Current Axis: {currentPrescription.axis}°
                </p>
              </div>

              <div className="mb-6">
                <VAChart />
              </div>

              <div className="mb-6">
                <JCCLens orientation={currentPrescription.axis} stage="axis" />
              </div>

              <div className="text-center mb-4">
                <p className="font-medium">Which is clearer?</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button onClick={() => handleLensSelection(1)}>Lens 1</Button>
                <Button onClick={() => handleLensSelection(2)}>Lens 2</Button>
              </div>

              <Button variant="outline" className="w-full" onClick={handleBothSame}>
                Both Same
              </Button>
            </Card>
          </div>
        ) : stage === STAGES.POWER_REFINEMENT || stage === STAGES.POWER_CONFIRMATION ? (
          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2">
                  {stage === STAGES.POWER_REFINEMENT ? "Power Refinement" : "Power Confirmation"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {eye} • Current Cylinder: {currentPrescription.cylinder.toFixed(2)} D
                </p>
              </div>

              <div className="mb-6">
                <VAChart />
              </div>

              <div className="mb-6">
                <JCCLens orientation={currentPrescription.axis} stage="power" />
              </div>

              <div className="text-center mb-4">
                <p className="font-medium">Which is clearer?</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button onClick={() => handleLensSelection(1)}>Lens 1</Button>
                <Button onClick={() => handleLensSelection(2)}>Lens 2</Button>
              </div>

              <Button variant="outline" className="w-full" onClick={handleBothSame}>
                Both Same
              </Button>
            </Card>
          </div>
        ) : stage === STAGES.RESULTS ? (
          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2">Results</h2>
                <p className="text-sm text-muted-foreground">Completed in {formatTime(timeElapsed)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Your Prescription</h3>
                  <p>Sphere: {currentPrescription.sphere.toFixed(2)} D</p>
                  <p>Cylinder: {currentPrescription.cylinder.toFixed(2)} D</p>
                  <p>Axis: {currentPrescription.axis}°</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">True Prescription</h3>
                  <p>Sphere: {truePrescription.sphere.toFixed(2)} D</p>
                  <p>Cylinder: {truePrescription.cylinder.toFixed(2)} D</p>
                  <p>Axis: {truePrescription.axis}°</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Accuracy</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sphere</span>
                      <span>{accuracy.sphere.toFixed(0)}%</span>
                    </div>
                    <Progress value={accuracy.sphere} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cylinder</span>
                      <span>{accuracy.cylinder.toFixed(0)}%</span>
                    </div>
                    <Progress value={accuracy.cylinder} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Axis</span>
                      <span>{accuracy.axis.toFixed(0)}%</span>
                    </div>
                    <Progress value={accuracy.axis} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall</span>
                      <span>{accuracy.overall.toFixed(0)}%</span>
                    </div>
                    <Progress value={accuracy.overall} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleRestart}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Case
                </Button>
                <Link href="/setup" className="w-full">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Exit
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  )
}
