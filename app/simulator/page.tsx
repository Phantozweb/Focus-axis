"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Eye, RefreshCw, RotateCcw, RotateCw, ChevronUp, ChevronDown, Info, Check } from "lucide-react"
import Link from "next/link"
import IntegratedEyeVisual from "@/components/integrated-eye-visual"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { generateRandomPrescription } from "@/lib/jcc-core"

// Convert 20/x format to 6/y format
const convertToMetricVA = (imperialVA) => {
  const parts = imperialVA.split("/")
  if (parts.length !== 2) return imperialVA

  const numerator = Math.round((Number.parseInt(parts[0]) / 20) * 6)
  const denominator = Math.round((Number.parseInt(parts[1]) / 20) * 6)

  return `${numerator}/${denominator}`
}

export default function SimulatorPage() {
  const router = useRouter()

  // Eye selection state
  const [activeEye, setActiveEye] = useState("OD") // OD = right eye, OS = left eye

  // Rotation increment state
  const [rotationIncrement, setRotationIncrement] = useState(5)

  // Patient prescription (the "true" prescription that needs to be determined)
  const [patientPrescription, setPatientPrescription] = useState({
    OD: { sphere: -5.5, cylinder: -2.0, axis: 5 },
    OS: { sphere: -5.25, cylinder: -1.75, axis: 175 },
  })

  // Current trial lens values
  const [trialLens, setTrialLens] = useState({
    OD: { sphere: -6.0, cylinder: -1.5, axis: 15 },
    OS: { sphere: -5.75, cylinder: -1.25, axis: 165 },
  })

  // JCC lens state
  const [jccLens, setJccLens] = useState({
    power: 0.25,
    orientation: 0,
    position: "axis", // "axis" or "power" refinement
    activeSide: "red", // "red" or "green"
    isFlipping: false,
  })

  // Visual acuity estimate
  const [visualAcuity, setVisualAcuity] = useState({
    OD: "6/12",
    OS: "6/12",
  })

  // Patient feedback dialog
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [patientFeedback, setPatientFeedback] = useState("")

  // Info dialog
  const [showInfoDialog, setShowInfoDialog] = useState(false)

  // Alignment indicator
  const [isAligned, setIsAligned] = useState(false)

  // Calculate remaining error
  const calculateError = (eye) => {
    const patient = patientPrescription[eye]
    const trial = trialLens[eye]

    // Calculate spherical equivalent
    const patientSphEquiv = patient.sphere + patient.cylinder / 2
    const trialSphEquiv = trial.sphere + trial.cylinder / 2

    // Calculate axis error (accounting for circular nature of axis)
    let axisDiff = Math.abs(patient.axis - trial.axis)
    if (axisDiff > 90) axisDiff = 180 - axisDiff

    return {
      sphere: (trial.sphere - patient.sphere).toFixed(2),
      cylinder: (trial.cylinder - patient.cylinder).toFixed(2),
      axis: axisDiff,
      sphericalEquivalent: (trialSphEquiv - patientSphEquiv).toFixed(2),
    }
  }

  // Generate random patient
  const generateRandomPatient = () => {
    const newOD = generateRandomPrescription()
    const newOS = generateRandomPrescription()

    setPatientPrescription({
      OD: newOD,
      OS: newOS,
    })

    // Set initial trial lens with slight errors
    setTrialLens({
      OD: {
        sphere: Math.round((newOD.sphere + (Math.random() > 0.5 ? 0.5 : -0.5)) * 4) / 4,
        cylinder: Math.round((newOD.cylinder + (Math.random() > 0.5 ? 0.25 : -0.25)) * 4) / 4,
        axis: Math.min(180, Math.max(1, newOD.axis + (Math.random() > 0.5 ? 10 : -10))),
      },
      OS: {
        sphere: Math.round((newOS.sphere + (Math.random() > 0.5 ? 0.5 : -0.5)) * 4) / 4,
        cylinder: Math.round((newOS.cylinder + (Math.random() > 0.5 ? 0.25 : -0.25)) * 4) / 4,
        axis: Math.min(180, Math.max(1, newOS.axis + (Math.random() > 0.5 ? 10 : -10))),
      },
    })
  }

  // Initialize with random patient on first load
  useEffect(() => {
    generateRandomPatient()
    // Show info dialog on first load
    setShowInfoDialog(true)
  }, [])

  // Check if JCC is aligned with cylinder axis
  useEffect(() => {
    // For axis refinement, check if JCC is at 45° to cylinder axis
    // For power refinement, check if JCC is aligned with cylinder axis
    const cylinderAxis = trialLens[activeEye].axis
    let targetOrientation

    if (jccLens.position === "axis") {
      // For axis refinement, JCC should be at 45° to cylinder axis
      targetOrientation = (cylinderAxis + 45) % 180
    } else {
      // For power refinement, JCC should align with cylinder axis
      targetOrientation = cylinderAxis
    }

    // Check if current orientation is close to target (within 2 degrees)
    const orientationDiff = Math.abs(jccLens.orientation - targetOrientation) % 180
    const isCloseToTarget = orientationDiff < 2 || orientationDiff > 178

    setIsAligned(isCloseToTarget)
  }, [jccLens.orientation, jccLens.position, trialLens, activeEye])

  // Update JCC orientation
  const rotateJCC = (direction) => {
    setJccLens((prev) => {
      // Calculate new orientation ensuring it stays between 0-180 degrees
      const newOrientation = (prev.orientation + direction * rotationIncrement) % 180
      return {
        ...prev,
        orientation: newOrientation <= 0 ? newOrientation + 180 : newOrientation,
      }
    })
  }

  // Update trial lens axis
  const rotateAxis = (direction) => {
    setTrialLens((prev) => ({
      ...prev,
      [activeEye]: {
        ...prev[activeEye],
        axis: Math.max(1, Math.min(180, prev[activeEye].axis + direction * rotationIncrement)),
      },
    }))
  }

  // Update trial lens sphere
  const adjustSphere = (direction) => {
    setTrialLens((prev) => ({
      ...prev,
      [activeEye]: {
        ...prev[activeEye],
        sphere: Math.round((prev[activeEye].sphere + direction * 0.25) * 4) / 4,
      },
    }))
  }

  // Update trial lens cylinder
  const adjustCylinder = (direction) => {
    setTrialLens((prev) => ({
      ...prev,
      [activeEye]: {
        ...prev[activeEye],
        cylinder: Math.round((prev[activeEye].cylinder + direction * 0.25) * 4) / 4,
      },
    }))
  }

  // Flip JCC lens with animation
  const flipJCC = () => {
    setJccLens((prev) => ({
      ...prev,
      isFlipping: true,
    }))

    // After a short delay, complete the flip
    setTimeout(() => {
      setJccLens((prev) => ({
        ...prev,
        activeSide: prev.activeSide === "red" ? "green" : "red",
        isFlipping: false,
      }))
    }, 150)
  }

  // Fix the setJCCForRefinement function to correctly handle power refinement
  const setJCCForRefinement = () => {
    const cylinderAxis = trialLens[activeEye].axis

    if (jccLens.position === "axis") {
      // For axis refinement, JCC dots should be at 45° to the cylinder axis
      setJccLens((prev) => ({
        ...prev,
        orientation: (cylinderAxis + 45) % 180,
        activeSide: "red", // Reset to red side when changing position
      }))
    } else {
      // For power refinement, JCC dots should align with the cylinder axis
      // (This means the handle is at 45° to the cylinder axis)
      setJccLens((prev) => ({
        ...prev,
        orientation: cylinderAxis,
        activeSide: "red", // Reset to red side when changing position
      }))
    }
  }

  // Update the askPatientFeedback function to provide more realistic and varied responses
  // Replace the entire askPatientFeedback function with this improved version:

  const askPatientFeedback = () => {
    // Get the patient's true prescription and the current trial lens
    const patientRx = patientPrescription[activeEye]
    const trialRx = trialLens[activeEye]

    // Calculate the difference between the true and trial prescriptions
    let axisDiff = patientRx.axis - trialRx.axis
    if (axisDiff > 90) axisDiff -= 180
    if (axisDiff < -90) axisDiff += 180

    const cylDiff = patientRx.cylinder - trialRx.cylinder

    let feedback = ""

    // Add slight randomness to responses (simulating patient inconsistency)
    const inconsistencyFactor = Math.random() > 0.85

    if (jccLens.position === "axis") {
      // For axis refinement

      // If axis is very close to correct (within 3 degrees), both sides will be equally blurry
      if (Math.abs(axisDiff) < 3) {
        feedback = "Both sides look equally blurry."
      } else {
        // Determine which direction we need to rotate
        const needClockwiseRotation = axisDiff > 0

        // Calculate which side should be clearer based on JCC orientation relative to axis
        const jccOrientationRelativeToAxis = (jccLens.orientation - trialRx.axis + 180) % 180

        // This determines if the red dot is in the clockwise direction from the axis
        const redDotIsClockwise =
          (jccOrientationRelativeToAxis > 0 && jccOrientationRelativeToAxis < 90) ||
          (jccOrientationRelativeToAxis > 180 && jccOrientationRelativeToAxis < 270)

        // If we need to rotate clockwise and red dot is clockwise, red should be clearer
        // Or if we need to rotate counterclockwise and red dot is counterclockwise, red should be clearer
        let redSideClearer =
          (needClockwiseRotation && redDotIsClockwise) || (!needClockwiseRotation && !redDotIsClockwise)

        // Occasionally provide inconsistent feedback to simulate real patient responses
        if (inconsistencyFactor) {
          redSideClearer = !redSideClearer
        }

        // Determine which side is clearer based on the active side and the needed rotation
        if ((redSideClearer && jccLens.activeSide === "red") || (!redSideClearer && jccLens.activeSide === "green")) {
          feedback = "This side appears CLEARER."
        } else {
          feedback = "This side appears MORE BLURRED."
        }
      }
    } else {
      // For power refinement

      // If cylinder power is very close, both sides will be equally blurry
      if (Math.abs(cylDiff) < 0.125) {
        feedback = "Both sides look equally blurry."
      } else {
        // For power refinement:
        // If patient needs more minus cylinder (cylDiff < 0), the green side (-) should be clearer
        // If patient needs less minus cylinder (cylDiff > 0), the red side (+) should be clearer
        let redSideClearer = cylDiff > 0

        // Occasionally provide inconsistent feedback to simulate real patient responses
        if (inconsistencyFactor) {
          redSideClearer = !redSideClearer
        }

        if ((redSideClearer && jccLens.activeSide === "red") || (!redSideClearer && jccLens.activeSide === "green")) {
          feedback = "This side appears CLEARER."
        } else {
          feedback = "This side appears MORE BLURRED."
        }
      }
    }

    // Add more detailed clinical feedback
    if (feedback === "This side appears CLEARER.") {
      if (jccLens.position === "axis") {
        feedback += " Rotate axis toward this side."
      } else {
        if (jccLens.activeSide === "red") {
          feedback += " Reduce minus cylinder by 0.25D and add +0.25D to sphere."
        } else {
          feedback += " Increase minus cylinder by 0.25D and subtract 0.25D from sphere."
        }
      }
    }

    setPatientFeedback(feedback)
    setShowFeedbackDialog(true)
  }

  // Calculate visual acuity based on error
  useEffect(() => {
    const error = calculateError(activeEye)
    const totalError =
      Math.abs(Number.parseFloat(error.sphericalEquivalent)) + Math.abs(Number.parseFloat(error.cylinder) / 2)

    let acuity = "6/6"
    if (totalError > 1.5) acuity = "6/60"
    else if (totalError > 1.0) acuity = "6/36"
    else if (totalError > 0.75) acuity = "6/24"
    else if (totalError > 0.5) acuity = "6/18"
    else if (totalError > 0.25) acuity = "6/12"

    setVisualAcuity((prev) => ({
      ...prev,
      [activeEye]: acuity,
    }))
  }, [trialLens, activeEye])

  const error = calculateError(activeEye)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-sky-500" />
            <h1 className="text-xl font-bold text-sky-500">Focus Axis</h1>
            <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Indian Standard</span>
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sky-500 hover:bg-sky-50"
                    onClick={() => setShowInfoDialog(true)}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>About JCC Simulator</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-sky-500 hover:bg-sky-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel - Controls */}
          <div className="space-y-4">
            <Card className="border-sky-100 shadow-sm">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 font-medium">
                Rotation Increment
              </div>
              <div className="p-4">
                <RadioGroup
                  value={rotationIncrement.toString()}
                  onValueChange={(v) => setRotationIncrement(Number.parseInt(v))}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="r15" />
                    <Label htmlFor="r15">15°</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="r5" />
                    <Label htmlFor="r5">5°</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="r1" />
                    <Label htmlFor="r1">1°</Label>
                  </div>
                </RadioGroup>
              </div>
            </Card>

            <Card className="border-sky-100 shadow-sm">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 font-medium">
                Trial Lens
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sphere">Spherical Lens</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-sky-200"
                      onClick={() => adjustSphere(-1)}
                    >
                      <ChevronDown className="h-4 w-4 text-sky-500" />
                    </Button>
                    <Input
                      id="sphere"
                      value={trialLens[activeEye].sphere.toFixed(2)}
                      readOnly
                      className="text-center border-sky-200"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-sky-200"
                      onClick={() => adjustSphere(1)}
                    >
                      <ChevronUp className="h-4 w-4 text-sky-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cylinder">Cylinder Lens</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-sky-200"
                      onClick={() => adjustCylinder(-1)}
                    >
                      <ChevronDown className="h-4 w-4 text-sky-500" />
                    </Button>
                    <Input
                      id="cylinder"
                      value={trialLens[activeEye].cylinder.toFixed(2)}
                      readOnly
                      className="text-center border-sky-200"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-sky-200"
                      onClick={() => adjustCylinder(1)}
                    >
                      <ChevronUp className="h-4 w-4 text-sky-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="axis">Axis</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-sky-200"
                      onClick={() => rotateAxis(-1)}
                    >
                      <RotateCcw className="h-4 w-4 text-sky-500" />
                    </Button>
                    <Input
                      id="axis"
                      value={trialLens[activeEye].axis + "°"}
                      readOnly
                      className="text-center border-sky-200"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-sky-200"
                      onClick={() => rotateAxis(1)}
                    >
                      <RotateCw className="h-4 w-4 text-sky-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-sky-100 shadow-sm">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 font-medium">
                Cross Cylinder
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jcc-power">Power</Label>
                  <Select
                    value={jccLens.power.toString()}
                    onValueChange={(v) => setJccLens((prev) => ({ ...prev, power: Number.parseFloat(v) }))}
                  >
                    <SelectTrigger className="border-sky-200">
                      <SelectValue placeholder="Select power" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.25">±0.25</SelectItem>
                      <SelectItem value="0.5">±0.50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jcc-position">Position</Label>
                  <Select
                    value={jccLens.position}
                    onValueChange={(v) => setJccLens((prev) => ({ ...prev, position: v }))}
                  >
                    <SelectTrigger className="border-sky-200">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="axis">Axis Refinement</SelectItem>
                      <SelectItem value="power">Power Refinement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jcc-orientation">JCC Orientation</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-sky-200"
                      onClick={() => rotateJCC(-1)}
                    >
                      <RotateCcw className="h-4 w-4 text-sky-500" />
                    </Button>
                    <Input
                      id="jcc-orientation"
                      value={jccLens.orientation + "°"}
                      readOnly
                      className="text-center border-sky-200"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-sky-200"
                      onClick={() => rotateJCC(1)}
                    >
                      <RotateCw className="h-4 w-4 text-sky-500" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className={`border-sky-200 hover:bg-sky-50 ${isAligned ? "bg-green-50 text-green-600" : "text-sky-500"}`}
                    onClick={setJCCForRefinement}
                  >
                    {isAligned && <Check className="h-4 w-4 mr-2" />}
                    {jccLens.position === "axis" ? "Fix for Axis Refinement" : "Fix for Power Refinement"}
                  </Button>
                  <Button className="bg-sky-500 hover:bg-sky-600" onClick={flipJCC}>
                    Flip JCC
                  </Button>
                </div>

                <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={askPatientFeedback}>
                  Ask Patient
                </Button>
              </div>
            </Card>

            <Card className="border-sky-100 shadow-sm">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 font-medium">
                Patient
              </div>
              <div className="p-4 space-y-4">
                <Tabs defaultValue="OD" onValueChange={setActiveEye}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="OD" className="data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700">
                      Right Eye (OD)
                    </TabsTrigger>
                    <TabsTrigger value="OS" className="data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700">
                      Left Eye (OS)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Button
                  variant="outline"
                  className="w-full border-sky-200 text-sky-500 hover:bg-sky-50"
                  onClick={generateRandomPatient}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Random Patient
                </Button>
              </div>
            </Card>
          </div>

          {/* Middle panel - Visual */}
          <div className="flex flex-col space-y-4 lg:col-span-2">
            <Card className="border-sky-100 shadow-md flex-1">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 font-medium">
                <span className="text-lg text-sky-700">Visual Simulation</span>
              </div>
              <div className="p-4 flex items-center justify-center">
                <IntegratedEyeVisual
                  eye={activeEye}
                  trialLens={trialLens[activeEye]}
                  jccLens={jccLens}
                  visualAcuity={visualAcuity[activeEye]}
                  patientRx={patientPrescription[activeEye]}
                />
              </div>
            </Card>

            <Card className="border-sky-100 shadow-sm">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 font-medium">
                Refraction Results
              </div>
              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Component</TableHead>
                      <TableHead>Sph</TableHead>
                      <TableHead>Cyl</TableHead>
                      <TableHead>Axis</TableHead>
                      <TableHead>Sph Equiv.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Trial Lens</TableCell>
                      <TableCell>{trialLens[activeEye].sphere.toFixed(2)}</TableCell>
                      <TableCell>{trialLens[activeEye].cylinder.toFixed(2)}</TableCell>
                      <TableCell>{trialLens[activeEye].axis}</TableCell>
                      <TableCell>
                        {(trialLens[activeEye].sphere + trialLens[activeEye].cylinder / 2).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Patient (Hidden)</TableCell>
                      <TableCell>???</TableCell>
                      <TableCell>???</TableCell>
                      <TableCell>???</TableCell>
                      <TableCell>???</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Remaining Error</TableCell>
                      <TableCell className={Number.parseFloat(error.sphere) === 0 ? "text-green-600" : "text-red-600"}>
                        {error.sphere}
                      </TableCell>
                      <TableCell
                        className={Number.parseFloat(error.cylinder) === 0 ? "text-green-600" : "text-red-600"}
                      >
                        {error.cylinder}
                      </TableCell>
                      <TableCell className={error.axis === 0 ? "text-green-600" : "text-red-600"}>
                        {error.axis}
                      </TableCell>
                      <TableCell
                        className={
                          Number.parseFloat(error.sphericalEquivalent) === 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {error.sphericalEquivalent}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card className="border-sky-100 shadow-sm mb-4">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 font-medium">
                Patient's Current Prescription (Starting Point)
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-center">
                    <div className="text-xs text-sky-400 uppercase font-semibold">Sphere</div>
                    <div className="text-lg font-bold text-sky-600">{trialLens[activeEye].sphere.toFixed(2)}D</div>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-center">
                    <div className="text-xs text-sky-400 uppercase font-semibold">Cylinder</div>
                    <div className="text-lg font-bold text-sky-600">{trialLens[activeEye].cylinder.toFixed(2)}D</div>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-center">
                    <div className="text-xs text-sky-400 uppercase font-semibold">Axis</div>
                    <div className="text-lg font-bold text-sky-600">{trialLens[activeEye].axis}°</div>
                  </div>
                </div>
                <p className="text-sm text-sky-600 mt-3">
                  This is the patient's current prescription that needs refinement. Use the JCC to find the optimal
                  prescription.
                </p>
              </div>
            </Card>

            <Card className="border-sky-100 shadow-sm">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 font-medium">
                Instructions
              </div>

              <div className="p-4 space-y-2 text-sm">
                <p className="font-medium text-sky-600 mb-2">
                  This is a practice simulator - you must manually adjust the prescription!
                </p>
                <p>1. Select the eye you want to refract (OD or OS)</p>
                <p>2. Set the JCC position for axis or power refinement</p>
                <p>3. For axis refinement: Click "Fix for Axis Refinement" to position JCC at 45° to cylinder axis</p>
                <p>4. For power refinement: Click "Fix for Power Refinement" to align JCC dots with cylinder axis</p>
                <p>5. Flip the JCC lens (this swaps red and green sides) and ask for patient feedback</p>
                <p>6. For axis refinement: Manually rotate axis toward the clearer side</p>
                <p>7. For power refinement: Manually adjust cylinder power based on feedback</p>
                <p className="font-medium mt-4">Tips:</p>
                <p>- Red dots are positioned opposite each other (top and bottom)</p>
                <p>- Green dots are positioned opposite each other (left and right)</p>
                <p>- When you flip the JCC, red dots become green and vice versa</p>
                <p>- In axis refinement, the JCC dots should be at 45° to the cylinder axis</p>
                <p>- In power refinement, the JCC dots should align with the cylinder axis</p>
                <p>- Rotate the axis toward the clearer side when flipping between red/green</p>
                <p>- In power refinement, increase cylinder if red is clearer, decrease if green is clearer</p>
                <p>- Remember to adjust sphere when changing cylinder power (by half the cylinder change)</p>
                <p className="font-medium mt-4">Clinical Rules for Power Refinement:</p>
                <p>- If patient prefers RED (plus cylinder): Reduce minus cylinder by 0.25D and add +0.25D to sphere</p>
                <p>
                  - If patient prefers GREEN (minus cylinder): Increase minus cylinder by 0.25D and subtract -0.25D from
                  sphere
                </p>
                <p>- This maintains the spherical equivalent while optimizing cylinder power</p>
              </div>
            </Card>

            <div className="flex space-x-4">
              <Button
                className="flex-1 bg-sky-500 hover:bg-sky-600"
                onClick={() => {
                  // Reveal patient prescription
                  alert(
                    `Patient Prescription (${activeEye}):\nSphere: ${patientPrescription[activeEye].sphere.toFixed(2)}\nCylinder: ${patientPrescription[activeEye].cylinder.toFixed(2)}\nAxis: ${patientPrescription[activeEye].axis}°`,
                  )
                }}
              >
                Reveal Prescription
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-sky-200 text-sky-500 hover:bg-sky-50"
                onClick={generateRandomPatient}
              >
                New Patient
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Patient Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-sky-700">Patient Feedback</DialogTitle>
            <DialogDescription>
              Based on this feedback, manually adjust the prescription using the controls
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-sky-50 rounded-lg border border-sky-200 text-center my-4 shadow-inner">
            <p className="text-xl font-medium text-sky-700">{patientFeedback}</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-4">
            <p className="text-sm text-amber-700 font-bold mb-2">Clinical Rules:</p>
            {jccLens.position === "axis" ? (
              <p className="text-sm text-amber-700">For axis refinement, rotate the axis toward the clearer side.</p>
            ) : (
              <>
                <p className="text-sm text-amber-700">
                  • If RED side is clearer: Reduce minus cylinder by 0.25D and add +0.25D to sphere
                </p>
                <p className="text-sm text-amber-700">
                  • If GREEN side is clearer: Increase minus cylinder by 0.25D and subtract 0.25D from sphere
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-sky-500 hover:bg-sky-600 text-lg py-6"
              onClick={() => setShowFeedbackDialog(false)}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>About Focus Axis JCC Simulator</DialogTitle>
            <DialogDescription>Indian Standard JCC Refraction Simulator</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Welcome to Focus Axis, a free virtual JCC (Jackson Cross Cylinder) simulator designed to help optometry
              students and practitioners practice refraction techniques.
            </p>
            <p>
              This simulator follows the Indian Standard approach to JCC refraction, which may differ slightly from
              other international methods.
            </p>
            <p>Key features:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Practice axis refinement with red and green indicators</li>
              <li>Practice power refinement with proper cylinder alignment</li>
              <li>Realistic patient responses based on prescription errors</li>
              <li>Visual acuity estimation in 6/6 format</li>
              <li>Detailed instructions for proper JCC technique</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Powered by Focus. This is a free educational tool for virtual JCC practice.
            </p>
          </div>
          <DialogFooter>
            <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={() => setShowInfoDialog(false)}>
              Start Practicing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-sky-100 py-3 bg-sky-50 mt-6">
        <div className="container mx-auto px-4 text-center text-sm text-sky-500/70">
          © {new Date().getFullYear()} Focus Axis - A Free Indian Standard JCC Refraction Simulator
        </div>
      </footer>
    </div>
  )
}
