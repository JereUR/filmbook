import { NextRequest } from "next/server"

import prisma from "@/lib/prisma"
import { TournamentsPage } from "@/lib/types"

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined
    const pageSize = 10

    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        participants: true,
        dates: true,
      },
    })

    const nextCursor =
      tournaments.length > pageSize ? tournaments[pageSize].id : null

    const data: TournamentsPage = {
      tournaments: tournaments.slice(0, pageSize).map((tournament) => ({
        id: tournament.id,
        name: tournament.name,
        description: tournament.description,
        participants: tournament.participants.length,
        startDate: tournament.startDate,
        endDate: tournament.endDate || undefined,
        dates: tournament.dates.filter((d) => d.visible).length,
        createdAt: tournament.createdAt,
        updatedAt: tournament.updatedAt,
      })),
      nextCursor,
    }

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
