import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"

export async function POST(req: Request) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { nominationId, predictedWinner } = await req.json()

  try {
    const prediction = await prisma.prediction.create({
      data: {
        userId: user.id,
        nominationId,
        predictedWinner,
        awardEventId: "oscars-2024",
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
