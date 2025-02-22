import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import type { AwardEvent } from "@/types/predictions"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId } = params

  try {
    const predictions = await prisma.prediction.findMany({
      where: {
        userId: userId,
      },
      include: {
        awardEvent: true,
      },
      orderBy: [
        { awardEvent: { year: "desc" } },
        { awardEvent: { name: "asc" } },
        { category: "asc" },
      ],
    })

    if (!predictions.length) {
      return NextResponse.json([], { status: 200 })
    }

    const groupedPredictions = predictions.reduce(
      (acc, prediction) => {
        const eventKey = `${prediction.awardEvent.name}-${prediction.awardEvent.year}`
        if (!acc[eventKey]) {
          acc[eventKey] = {
            name: prediction.awardEvent.name,
            year: prediction.awardEvent.year,
            categories: {},
          }
        }
        acc[eventKey].categories[prediction.category] = {
          id: prediction.id,
          predictedWinnerName: prediction.predictedWinnerName,
          predictedWinnerImage: prediction.predictedWinnerImage,
          favoriteWinnerName: prediction.favoriteWinnerName,
          favoriteWinnerImage: prediction.favoriteWinnerImage,
        }
        return acc
      },
      {} as Record<string, AwardEvent>,
    )

    return NextResponse.json(Object.values(groupedPredictions))
  } catch (error) {
    console.error("Failed to fetch predictions:", error)
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
      { status: 500 },
    )
  }
}
