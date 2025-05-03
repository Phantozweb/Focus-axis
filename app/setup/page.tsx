"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const router = useRouter()
  const [jccPower, setJccPower] = useState("0.25")
  const [difficulty, setDifficulty] = useState("moderate")
  const [eye, setEye] = useState("random")

  const handleStart = () => {
    // In a real app, we would store these settings in a context or state management
    // For now, we'll just navigate to the practice page
    router.push("/practice")
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
              <CardTitle>Practice Session Setup</CardTitle>
              <CardDescription>Configure your JCC practice session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">JCC Power</h3>
                <RadioGroup value={jccPower} onValueChange={setJccPower} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0.25" id="jcc-0.25" />
                    <Label htmlFor="jcc-0.25">±0.25 D (Standard)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0.50" id="jcc-0.50" />
                    <Label htmlFor="jcc-0.50">±0.50 D (Higher Power)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Difficulty Level</h3>
                <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="difficulty-easy" />
                    <Label htmlFor="difficulty-easy">Easy (Clear responses, larger errors)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="difficulty-moderate" />
                    <Label htmlFor="difficulty-moderate">Moderate (Standard clinical scenario)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="difficulty-hard" />
                    <Label htmlFor="difficulty-hard">Hard (Inconsistent responses, subtle errors)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Eye Selection</h3>
                <RadioGroup value={eye} onValueChange={setEye} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="random" id="eye-random" />
                    <Label htmlFor="eye-random">Random (OD or OS)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OD" id="eye-od" />
                    <Label htmlFor="eye-od">Right Eye (OD)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OS" id="eye-os" />
                    <Label htmlFor="eye-os">Left Eye (OS)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleStart}>
                Start Practice
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
