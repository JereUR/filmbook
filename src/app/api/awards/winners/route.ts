import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        winnerId: { not: null },
      },
      include: {
        winner: true,
      },
    })

    const winnersMap = categories.reduce(
      (acc, category) => {
        acc[category.name] = category.winner?.name || ""
        return acc
      },
      {} as Record<string, string>,
    )

    return NextResponse.json(winnersMap)
  } catch (error) {
    console.error("Failed to fetch winners:", error)
    return NextResponse.json(
      { error: "Failed to fetch winners" },
      { status: 500 },
    )
  }
}
