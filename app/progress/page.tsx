"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"

// Mock data for progress tracking
const MOCK_SESSIONS = [
  {
    id: 1,
    date: "2025-04-28",
    eye: "OD",
    duration: 125,
    accuracy: {
      sphere: 92,
      cylinder: 88,
      axis: 95,
      overall: 92,
    },
  },
  {
    id: 2,
    date: "2025-04-28",
    eye: "OS",
    duration: 98,
    accuracy: {
      sphere: 95,
      cylinder: 90,
      axis: 87,
      overall: 91,
    },
  },
  {
    id: 3,
    date: "2025-04-27",
    eye: "OD",
    duration: 145,
    accuracy: {
      sphere: 85,
      cylinder: 82,
      axis: 88,
      overall: 85,
    },
  },
  {
    id: 4,
    date: "2025-04-27",
    eye: "OS",
    duration: 132,
    accuracy: {
      sphere: 88,
      cylinder: 85,
      axis: 80,
      overall: 84,
    },
  },
  {
    id: 5,
    date: "2025-04-26",
    eye: "OD",
    duration: 180,
    accuracy: {
      sphere: 80,
      cylinder: 75,
      axis: 82,
      overall: 79,
    },
  },
]

// Format time for display
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

export default function ProgressPage() {
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Progress Tracking</h1>

          <Tabs defaultValue="sessions">
            <TabsList className="mb-6">
              <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions">
              <div className="grid gap-4">
                {MOCK_SESSIONS.map((session) => (
                  <Card key={session.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Session #{session.id} - {session.eye}
                        </CardTitle>
                        <CardDescription>{new Date(session.date).toLocaleDateString()}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{formatTime(session.duration)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                          <p className="font-medium">{session.accuracy.overall}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sphere Accuracy</p>
                          <p className="font-medium">{session.accuracy.sphere}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cylinder Accuracy</p>
                          <p className="font-medium">{session.accuracy.cylinder}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Statistics</CardTitle>
                  <CardDescription>Your overall performance across all sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Average Accuracy</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Overall</p>
                          <p className="text-2xl font-bold">86%</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Sphere</p>
                          <p className="text-2xl font-bold">88%</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Cylinder</p>
                          <p className="text-2xl font-bold">84%</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Axis</p>
                          <p className="text-2xl font-bold">86%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Average Time</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Per Session</p>
                          <p className="text-2xl font-bold">2:16</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Improvement</p>
                          <p className="text-2xl font-bold text-green-500">-18%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Sessions Completed</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold">12</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">OD</p>
                          <p className="text-2xl font-bold">7</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">OS</p>
                          <p className="text-2xl font-bold">5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Your improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-lg">
                    <p className="text-muted-foreground">
                      Chart visualization would appear here showing accuracy and time trends
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
