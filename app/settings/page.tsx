"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Eye, Save } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [soundEffects, setSoundEffects] = useState(true)
  const [hapticFeedback, setHapticFeedback] = useState(true)
  const [showTimer, setShowTimer] = useState(true)
  const [patientConsistency, setPatientConsistency] = useState(50)
  const [autoFlipSpeed, setAutoFlipSpeed] = useState(2)

  const handleSave = () => {
    // In a real app, we would save these settings to localStorage or a database
    // For now, we'll just navigate back to the home page
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Focus.JCC</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your JCC practice experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Interface</h3>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-effects">Sound Effects</Label>
                  <Switch id="sound-effects" checked={soundEffects} onCheckedChange={setSoundEffects} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="haptic-feedback">Haptic Feedback</Label>
                  <Switch id="haptic-feedback" checked={hapticFeedback} onCheckedChange={setHapticFeedback} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-timer">Show Timer</Label>
                  <Switch id="show-timer" checked={showTimer} onCheckedChange={setShowTimer} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Simulation</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="patient-consistency">Patient Consistency</Label>
                    <span className="text-sm text-muted-foreground">{patientConsistency}%</span>
                  </div>
                  <Slider
                    id="patient-consistency"
                    min={0}
                    max={100}
                    step={10}
                    value={[patientConsistency]}
                    onValueChange={(value) => setPatientConsistency(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Inconsistent</span>
                    <span>Very Consistent</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="auto-flip-speed">Auto-Flip Speed</Label>
                    <span className="text-sm text-muted-foreground">{autoFlipSpeed}s</span>
                  </div>
                  <Slider
                    id="auto-flip-speed"
                    min={1}
                    max={5}
                    step={0.5}
                    value={[autoFlipSpeed]}
                    onValueChange={(value) => setAutoFlipSpeed(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Faster</span>
                    <span>Slower</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
