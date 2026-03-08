import { useState, useEffect } from "react"

export default function useOscarsWinners() {
  const [winners, setWinners] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchWinners() {
      try {
        const response = await fetch("/api/awards/winners")
        if (!response.ok) throw new Error("Failed to fetch winners")
        const data = await response.json()
        setWinners(data)
      } catch (error) {
        console.error("Error fetching winners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWinners()
  }, [])

  return winners
}
