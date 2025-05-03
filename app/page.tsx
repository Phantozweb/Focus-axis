"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, BookOpen, ArrowRight, Info } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-sky-500" />
            <h1 className="text-xl font-bold text-sky-500">Focus Axis</h1>
            <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Indian Standard</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold mb-4 text-sky-700 leading-tight">Virtual JCC Refraction Simulator</h1>
              <p className="text-lg text-sky-600/80 mb-6">
                Master the Jackson Cross Cylinder technique with our interactive simulator. Perfect for optometry
                students and practitioners looking to enhance their refraction skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/simulator">
                  <Button className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white">
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tutorial">
                  <Button variant="outline" className="w-full sm:w-auto border-sky-200 text-sky-500 hover:bg-sky-50">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Tutorial
                  </Button>
                </Link>
                <a href="https://focus-in.netlify.app/focus-axis" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="w-full sm:w-auto text-sky-500 hover:bg-sky-50">
                    <Info className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </a>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              {/* Animated JCC Lens */}
              <motion.div
                className="relative w-64 h-64"
                animate={{ rotate: [0, 45, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 10,
                  ease: "easeInOut",
                }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                  {/* JCC Circle */}
                  <circle cx="100" cy="100" r="90" fill="white" stroke="#64748b" strokeWidth="2" />

                  {/* Dividing lines */}
                  <line x1="10" y1="100" x2="190" y2="100" stroke="#64748b" strokeWidth="1" />
                  <line x1="100" y1="10" x2="100" y2="190" stroke="#64748b" strokeWidth="1" />

                  {/* Red dots - top and bottom */}
                  <circle cx="100" cy="10" r="10" fill="#ef4444" stroke="white" strokeWidth="1" />
                  <circle cx="100" cy="190" r="10" fill="#ef4444" stroke="white" strokeWidth="1" />

                  {/* Green dots - left and right */}
                  <circle cx="10" cy="100" r="10" fill="#22c55e" stroke="white" strokeWidth="1" />
                  <circle cx="190" cy="100" r="10" fill="#22c55e" stroke="white" strokeWidth="1" />

                  {/* Handle attached to edge at 45 degrees from dots */}
                  <line x1="140" y1="60" x2="170" y2="30" stroke="#333333" strokeWidth="6" strokeLinecap="round" />

                  {/* Power labels - moved outside dots and changed to black */}
                  <text x="100" y="-5" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">
                    +0.25
                  </text>
                  <text x="100" y="205" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">
                    +0.25
                  </text>
                  <text
                    x="-5"
                    y="100"
                    textAnchor="end"
                    fill="#000"
                    fontSize="10"
                    fontWeight="bold"
                    dominantBaseline="middle"
                  >
                    -0.25
                  </text>
                  <text
                    x="205"
                    y="100"
                    textAnchor="start"
                    fill="#000"
                    fontSize="10"
                    fontWeight="bold"
                    dominantBaseline="middle"
                  >
                    -0.25
                  </text>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Card className="border-sky-100 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-sky-400 to-sky-300"></div>
              <CardHeader className="bg-sky-50">
                <CardTitle className="text-sky-600">Practice Mode</CardTitle>
                <CardDescription>Realistic JCC simulation</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-sky-500/80">
                  Refine your skills with our virtual JCC simulator. Practice axis and power refinement with realistic
                  patient responses following Indian Standard techniques.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/simulator" className="w-full">
                  <Button className="w-full bg-sky-500 hover:bg-sky-600">Start Practice</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-sky-100 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-sky-300 to-sky-200"></div>
              <CardHeader className="bg-sky-50">
                <CardTitle className="text-sky-600">Tutorial Mode</CardTitle>
                <CardDescription>Step-by-step guidance</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-sky-500/80">
                  New to JCC? Our tutorial mode will guide you through each step of the process with helpful
                  visualizations and explanations based on Indian Standard practices.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/tutorial" className="w-full">
                  <Button variant="outline" className="w-full border-sky-200 text-sky-500 hover:bg-sky-50">
                    Start Tutorial
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Learn More Section */}
          <div id="learn-more" className="mt-12 bg-sky-50 p-8 rounded-xl border border-sky-100 shadow-sm">
            <h2 className="text-2xl font-bold text-sky-700 mb-4">About Indian Standard JCC</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sky-600/80 mb-4">
                  The Jackson Cross Cylinder (JCC) is an essential tool in subjective refraction, used to refine
                  cylinder power and axis. The Indian Standard approach uses red and green dots or lines for
                  orientation:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sky-600/80">
                  <li>
                    <span className="font-medium text-red-500">RED</span> indicators show PLUS power (+0.25D)
                  </li>
                  <li>
                    <span className="font-medium text-green-500">GREEN</span> indicators show MINUS power (-0.25D)
                  </li>
                  <li>For axis refinement, the JCC is positioned at 45° to the cylinder axis</li>
                  <li>For power refinement, the JCC is aligned with the cylinder axis</li>
                </ul>
                <p className="text-sky-600/80 mt-4 text-sm italic">
                  Note: In actual JCC lenses, the indicators may be dots or lines, and colors may vary due to
                  manufacturing. In this simulator, we use the standard red/green color scheme to indicate plus/minus
                  power.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <motion.div
                  className="relative w-48 h-48"
                  animate={{
                    rotateY: [0, 180, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 5,
                    ease: "easeInOut",
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                    {/* JCC Circle */}
                    <circle cx="100" cy="100" r="90" fill="white" stroke="#64748b" strokeWidth="2" />

                    {/* Cylinder Axis Line (Green) */}
                    <line x1="20" y1="100" x2="180" y2="100" stroke="#22c55e" strokeWidth="3" />

                    {/* Red dots - top and bottom */}
                    <circle cx="100" cy="10" r="10" fill="#ef4444" stroke="white" strokeWidth="1" />
                    <circle cx="100" cy="190" r="10" fill="#ef4444" stroke="white" strokeWidth="1" />

                    {/* Green dots - left and right */}
                    <circle cx="10" cy="100" r="10" fill="#22c55e" stroke="white" strokeWidth="1" />
                    <circle cx="190" cy="100" r="10" fill="#22c55e" stroke="white" strokeWidth="1" />

                    {/* Handle */}
                    <line x1="100" y1="20" x2="100" y2="0" stroke="#333333" strokeWidth="6" strokeLinecap="round" />

                    {/* Power labels - moved outside dots and changed to black */}
                    <text x="100" y="-5" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">
                      +0.25
                    </text>
                    <text x="100" y="205" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">
                      +0.25
                    </text>
                    <text
                      x="-5"
                      y="100"
                      textAnchor="end"
                      fill="#000"
                      fontSize="10"
                      fontWeight="bold"
                      dominantBaseline="middle"
                    >
                      -0.25
                    </text>
                    <text
                      x="205"
                      y="100"
                      textAnchor="start"
                      fill="#000"
                      fontSize="10"
                      fontWeight="bold"
                      dominantBaseline="middle"
                    >
                      -0.25
                    </text>
                  </svg>
                </motion.div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/tutorial">
                <Button className="bg-sky-500 hover:bg-sky-600">
                  Learn More in Tutorial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-sky-100 py-4 bg-sky-50 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-sky-500/70 mb-2">
            © {new Date().getFullYear()} Focus Axis - A Virtual JCC Refraction Simulator for Optometry Training
          </p>
          <p className="text-xs text-sky-400/70">
            <a
              href="https://focus-in.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Powered by Focus-in
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
