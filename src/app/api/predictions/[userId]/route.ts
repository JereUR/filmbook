import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"

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
    })

    if (!predictions.length) {
      return NextResponse.json(
        { message: "No predictions found for this user" },
        { status: 404 },
      )
    }

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Failed to fetch predictions:", error)
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
      { status: 500 },
    )
  }
}
