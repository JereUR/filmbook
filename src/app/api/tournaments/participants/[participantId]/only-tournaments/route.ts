import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateAdmin } from "@/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { participantId: string } },
): Promise<NextResponse<string[] | { error: string }>> {
  const { user, admin } = await validateAdmin()

  if (!user || !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const tournaments = await prisma.participant.findFirst({
      where: { id: params.participantId },
      select: {
        tournaments: {
          select: {
            tournament: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    const tournamentsForParticipant: string[] =
      tournaments?.tournaments.map((tournament) => tournament.tournament.id) ||
      []

    return NextResponse.json(tournamentsForParticipant)
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los datos del participante." },
      { status: 500 },
    )
  }
}
