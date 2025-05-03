"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"

// Tutorial steps
const TUTORIAL_STEPS = [
  {
    title: "Introduction to JCC",
    content:
      "The Jackson Cross Cylinder (JCC) is a lens used to refine cylinder power and axis during subjective refraction. It consists of two cylindrical lenses of equal power but opposite sign, placed with their axes perpendicular to each other.",
    image: null,
  },
  {
    title: "JCC Lens Design (Indian Standard)",
    content:
      "In the Indian Standard technique, the JCC lens has RED and GREEN indicators positioned 90 degrees apart from each other. The RED indicators show the POSITIVE cylinder power (+0.25D), while the GREEN indicators show the NEGATIVE cylinder power (-0.25D). These indicators may be dots or lines depending on the manufacturer, but the color coding is crucial for understanding patient responses.",
    image: "jcc",
  },
  {
    title: "Cylinder Axis Identification",
    content:
      "The GREEN LINE in the simulator represents the CYLINDER AXIS of the current trial lens. This is the reference line for all JCC positioning. For axis refinement, the JCC is positioned at 45° to this green line. For power refinement, the JCC is aligned with this green line.",
    image: "axis_line",
  },
  {
    title: "Axis Refinement",
    content:
      "For axis refinement, position the JCC handle aligned with the cylinder axis (green line). The red and green dots are positioned at 45° to this green line. When flipped between red and green sides, the patient will report which is clearer. If the RED side is clearer, rotate the cylinder axis TOWARD the red dot. If the GREEN side is clearer, rotate the cylinder axis TOWARD the green dot. Continue this process until the patient reports both sides are equally blurry.",
    image: "axis",
  },
  {
    title: "Power Refinement",
    content:
      "For power refinement, position the JCC with its handle at 45° to the cylinder axis (green line). The red and green dots should be aligned with and perpendicular to the cylinder axis. When flipped between red and green sides, follow these clinical rules:\n\n" +
      "• If patient prefers RED (plus cylinder): Reduce minus cylinder by 0.25D and add +0.25D to sphere\n\n" +
      "• If patient prefers GREEN (minus cylinder): Increase minus cylinder by 0.25D and subtract 0.25D from sphere\n\n" +
      "This maintains the spherical equivalent while optimizing cylinder power. Continue until both sides are equally blurry.",
    image: "power",
  },
  {
    title: "Step-by-Step JCC Procedure",
    content:
      "1. Start with axis refinement: Position JCC with handle aligned with cylinder axis (green line)\n" +
      "2. Flip JCC between red and green sides, asking which is clearer\n" +
      "3. Rotate axis toward the clearer side (red or green dot)\n" +
      "4. Repeat until patient reports both sides equally blurry\n" +
      "5. Switch to power refinement: Keep JCC handle aligned with cylinder axis (green line)\n" +
      "6. Flip JCC between red and green sides, asking which is clearer\n" +
      "7. Adjust cylinder power and sphere according to preference\n" +
      "8. Repeat until patient reports both sides equally blurry",
    image: null,
  },
  {
    title: "Ready to Practice",
    content:
      "Now you're ready to practice JCC technique in our simulator. Remember the key points:\n\n" +
      "• RED indicators = PLUS power (+)\n" +
      "• GREEN indicators = MINUS power (-)\n" +
      "• GREEN LINE = CYLINDER AXIS\n" +
      "• For axis refinement: JCC handle at 45° to green line, dots at 45° to axis\n" +
      "• For power refinement: JCC dots aligned with and perpendicular to green line\n\n" +
      "The simulator will provide patient responses, but you must make the correct adjustments yourself.",
    image: null,
  },
]

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Navigate to setup page when tutorial is complete
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentTutorial = TUTORIAL_STEPS[currentStep]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-sky-500" />
            <h1 className="text-xl font-bold text-sky-500">Focus Axis</h1>
            <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Indian Standard</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-sky-500 hover:bg-sky-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-sky-100 shadow-md overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-sky-400 to-sky-300"></div>
            <CardHeader className="bg-sky-50">
              <CardTitle className="text-xl text-sky-700">{currentTutorial.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6 text-sky-900 whitespace-pre-line">{currentTutorial.content}</p>

              {currentTutorial.image === "jcc" && (
                <div className="mb-6 bg-white p-4 rounded-lg border border-sky-100">
                  <div className="relative w-full max-w-[250px] mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* JCC Circle */}
                      <circle cx="100" cy="100" r="80" fill="white" stroke="black" strokeWidth="2" />

                      {/* JCC Axis Line */}
                      <line x1="20" y1="100" x2="180" y2="100" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />

                      {/* Red Dots at 45° and 225° from axis */}
                      <circle cx="157" cy="43" r="8" fill="#ef4444" />
                      <circle cx="43" cy="157" r="8" fill="#ef4444" />

                      {/* Green Dots at 135° and 315° from axis */}
                      <circle cx="43" cy="43" r="8" fill="#22c55e" />
                      <circle cx="157" cy="157" r="8" fill="#22c55e" />

                      {/* Handle */}
                      <line x1="100" y1="20" x2="100" y2="0" stroke="#333333" strokeWidth="8" strokeLinecap="round" />
                    </svg>

                    {/* Power labels in separate layer to avoid overlapping */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="absolute" style={{ top: "43px", left: "177px" }}>
                        <span className="bg-white bg-opacity-75 px-1 rounded text-xs font-bold text-black">+0.25</span>
                      </div>
                      <div className="absolute" style={{ top: "157px", left: "23px" }}>
                        <span className="bg-white bg-opacity-75 px-1 rounded text-xs font-bold text-black">+0.25</span>
                      </div>
                      <div className="absolute" style={{ top: "43px", left: "13px" }}>
                        <span className="bg-white bg-opacity-75 px-1 rounded text-xs font-bold text-black">-0.25</span>
                      </div>
                      <div className="absolute" style={{ top: "157px", left: "177px" }}>
                        <span className="bg-white bg-opacity-75 px-1 rounded text-xs font-bold text-black">-0.25</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-sky-700 bg-sky-50 p-2 rounded-md">
                    <strong>RED = PLUS (+)</strong> | <strong>GREEN = MINUS (-)</strong>
                    <br />
                    JCC with red and green indicators at 90° from each other
                  </div>
                </div>
              )}

              {currentTutorial.image === "axis_line" && (
                <div className="mb-6 bg-white p-4 rounded-lg border border-sky-100">
                  <div className="relative w-full max-w-[250px] mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Eye */}
                      <circle cx="100" cy="100" r="40" fill="white" stroke="#d1d5db" strokeWidth="2" />
                      <circle cx="100" cy="100" r="25" fill="#3b82f6" />
                      <circle cx="100" cy="100" r="12" fill="black" />
                      <circle cx="105" cy="95" r="5" fill="white" />

                      {/* Cylinder Axis Line (Green) */}
                      <line x1="20" y1="100" x2="180" y2="100" stroke="#22c55e" strokeWidth="3" />
                      <text x="185" y="100" fill="#22c55e" fontSize="14" fontWeight="bold" dominantBaseline="middle">
                        Axis
                      </text>

                      {/* JCC Circle */}
                      <circle cx="100" cy="100" r="80" fill="none" stroke="black" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="mt-4 text-center text-sm text-sky-700 bg-sky-50 p-2 rounded-md">
                    <strong>GREEN LINE = CYLINDER AXIS</strong>
                    <br />
                    The green line represents the cylinder axis
                  </div>
                </div>
              )}

              {currentTutorial.image === "axis" && (
                <div className="mb-6 bg-white p-4 rounded-lg border border-sky-100">
                  <div className="relative w-full max-w-[250px] mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Background */}
                      <rect x="0" y="0" width="200" height="200" fill="white" rx="8" />

                      {/* Eye */}
                      <circle cx="100" cy="100" r="40" fill="white" stroke="#d1d5db" strokeWidth="2" />
                      <circle cx="100" cy="100" r="25" fill="#3b82f6" />
                      <circle cx="100" cy="100" r="12" fill="black" />
                      <circle cx="105" cy="95" r="5" fill="white" />

                      {/* Cylinder Axis Line (Green) */}
                      <line x1="20" y1="100" x2="180" y2="100" stroke="#22c55e" strokeWidth="3" />
                      <text x="185" y="100" fill="#22c55e" fontSize="12" fontWeight="bold" dominantBaseline="middle">
                        Axis
                      </text>

                      {/* JCC Circle */}
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#64748b" strokeWidth="2" />

                      {/* Red Dots at 45° from axis */}
                      <circle cx="100" cy="20" r="8" fill="#ef4444" />
                      <circle cx="100" cy="180" r="8" fill="#ef4444" />

                      {/* Green Dots at 45° from axis */}
                      <circle cx="20" cy="100" r="8" fill="#22c55e" />
                      <circle cx="180" cy="100" r="8" fill="#22c55e" />

                      {/* Handle aligned with cylinder axis */}
                      <line
                        x1="180"
                        y1="100"
                        x2="200"
                        y2="100"
                        stroke="#333333"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="mt-4 text-center text-sm text-sky-700 bg-sky-50 p-2 rounded-md">
                    <strong>Axis Refinement: Handle aligned with cylinder axis</strong>
                    <br />
                    Red and green dots positioned at 45° to axis
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-2 rounded-lg border border-red-100">
                      <div className="text-center font-medium text-red-600 mb-1">If RED side is clearer:</div>
                      <div className="text-xs text-red-600 text-center">Rotate axis toward the red dot</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg border border-green-100">
                      <div className="text-center font-medium text-green-600 mb-1">If GREEN side is clearer:</div>
                      <div className="text-xs text-green-600 text-center">Rotate axis toward the green dot</div>
                    </div>
                  </div>
                </div>
              )}

              {currentTutorial.image === "power" && (
                <div className="mb-6 bg-white p-4 rounded-lg border border-sky-100">
                  <div className="relative w-full max-w-[250px] mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Background */}
                      <rect x="0" y="0" width="200" height="200" fill="white" rx="8" />

                      {/* Eye */}
                      <circle cx="100" cy="100" r="40" fill="white" stroke="#d1d5db" strokeWidth="2" />
                      <circle cx="100" cy="100" r="25" fill="#3b82f6" />
                      <circle cx="100" cy="100" r="12" fill="black" />
                      <circle cx="105" cy="95" r="5" fill="white" />

                      {/* Cylinder Axis Line (Green) */}
                      <line x1="20" y1="100" x2="180" y2="100" stroke="#22c55e" strokeWidth="3" />
                      <text x="185" y="100" fill="#22c55e" fontSize="12" fontWeight="bold" dominantBaseline="middle">
                        Axis
                      </text>

                      {/* JCC Circle */}
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#64748b" strokeWidth="2" />

                      {/* Red Dots aligned with axis */}
                      <circle cx="20" cy="100" r="8" fill="#ef4444" />
                      <circle cx="180" cy="100" r="8" fill="#ef4444" />

                      {/* Green Dots perpendicular to axis */}
                      <circle cx="100" cy="20" r="8" fill="#22c55e" />
                      <circle cx="100" cy="180" r="8" fill="#22c55e" />

                      {/* Handle at 45° to cylinder axis */}
                      <line x1="150" y1="50" x2="170" y2="30" stroke="#333333" strokeWidth="8" strokeLinecap="round" />
                    </svg>

                    {/* Power labels in separate layer to avoid overlapping */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="absolute" style={{ top: "100px", left: "0px", transform: "translateY(-50%)" }}>
                        <span className="bg-white bg-opacity-75 px-1 rounded text-xs font-bold text-black">+0.25</span>
                      </div>
                      <div className="absolute" style={{ top: "100px", left: "190px", transform: "translateY(-50%)" }}>
                        <span className="bg-white bg-opacity-75 px-1 rounded text-xs font-bold text-black">+0.25</span>
                      </div>
                      <div className="absolute" style={{ top: "0px", left: "100px", transform: "translateX(-50%)" }}>
                        <span className="bg-white bg-opacity-75 px-1 rounded text-xs font-bold text-black">-0.25</span>
                      </div>
                      <div className="absolute" style={{ top: "190px", left: "100px", transform: "translateX(-50%)" }}>
                        <span className="bg-white bg-opacity-75 px-1 rounded text-xs font-bold text-black">-0.25</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm text-sky-700 bg-sky-50 p-2 rounded-md">
                    <strong>Power Refinement: Handle at 45° to cylinder axis</strong>
                    <br />
                    Red dots aligned with axis, green dots perpendicular to axis
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                      <div className="text-center font-medium text-red-600 mb-1">If RED side is clearer:</div>
                      <div className="text-sm text-red-600 text-center">
                        Reduce minus cylinder by 0.25D
                        <br />
                        Add +0.25D to sphere
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <div className="text-center font-medium text-green-600 mb-1">If GREEN side is clearer:</div>
                      <div className="text-sm text-green-600 text-center">
                        Increase minus cylinder by 0.25D
                        <br />
                        Subtract 0.25D from sphere
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-sky-600">
                  Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: TUTORIAL_STEPS.length }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-sky-500" : "bg-sky-200"}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-sky-50 border-t border-sky-100">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-sky-200 text-sky-500 hover:bg-sky-100"
              >
                Previous
              </Button>

              {currentStep < TUTORIAL_STEPS.length - 1 ? (
                <Button onClick={handleNext} className="bg-sky-500 hover:bg-sky-600">
                  Next
                </Button>
              ) : (
                <Link href="/simulator">
                  <Button className="bg-sky-500 hover:bg-sky-600">Start Practice</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
