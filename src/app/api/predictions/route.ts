import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"

export async function POST(req: Request) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { category, predictedWinner, favoriteWinner } = await req.json()

  try {
    const awardEvent = await prisma.awardEvent.findFirst({
      where: {
        name: "Oscars",
        year: 2024,
      },
    })

    if (!awardEvent) {
      return NextResponse.json(
        { error: "Award event not found" },
        { status: 404 },
      )
    }

    const prediction = await prisma.prediction.create({
      data: {
        userId: user.id,
        awardEventId: awardEvent.id,
        category,
        predictedWinner,
        favoriteWinner,
      },
    })

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Failed to create prediction:", error)
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 },
    )
  }
}
