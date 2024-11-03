import { NextRequest } from "next/server"

import prisma from "@/lib/prisma"
import { TournamentData } from "@/lib/types"

export async function GET(req: NextRequest) {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        participants: true,
        dates: true,
      },
    })

    const data: TournamentData[] = tournaments.map((tournament) => ({
      id: tournament.id,
      name: tournament.name,
      description: tournament.description || null,
      participants: tournament.participants.length,
      dates: tournament.dates.length,
      startDate: tournament.startDate,
      endDate: tournament.endDate || undefined,
      createdAt: tournament.createdAt,
      updatedAt: tournament.updatedAt,
    }))

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
