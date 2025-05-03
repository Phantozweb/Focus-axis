"use client"

import { useState, useEffect } from "react"

// VA chart letters (commonly used optotypes)
const VA_LETTERS = ["E", "F", "P", "T", "O", "Z", "D", "L", "C"]

export default function VAChart() {
  const [letters, setLetters] = useState<string[]>([])

  // Generate random letters for the VA chart
  useEffect(() => {
    const generateLetters = () => {
      const newLetters = []
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * VA_LETTERS.length)
        newLetters.push(VA_LETTERS[randomIndex])
      }
      return newLetters
    }

    setLetters(generateLetters())

    // Regenerate letters periodically to simulate different views
    const interval = setInterval(() => {
      setLetters(generateLetters())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white border rounded-lg p-4 flex justify-center items-center">
      <div className="text-center">
        <div className="font-mono text-3xl tracking-wider mb-2">{letters.join(" ")}</div>
        <div className="text-xs text-muted-foreground">Visual Acuity Chart</div>
      </div>
    </div>
  )
}
