import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateAdmin } from "@/auth"
import { ParticipantResponse, TournamentParticipantData } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { participantId: string } },
): Promise<NextResponse<ParticipantResponse | { error: string }>> {
  const { user, admin } = await validateAdmin()
  if (!user && !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const participant = await prisma.participant.findFirst({
      where: { id: params.participantId },
      select: {
        tournaments: {
          select: {
            tournament: {
              select: {
                id: true,
                name: true,
                dates: {
                  select: {
                    id: true,
                    date: true,
                    scores: {
                      where: { participantId: params.participantId },
                      select: {
                        points: true,
                        extraPoints: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    const formattedData: TournamentParticipantData[] =
      participant?.tournaments.map((tournament) => ({
        tournamentId: tournament.tournament.id,
        tournamentName: tournament.tournament.name,
        dates: tournament.tournament.dates.map((date) => ({
          dateId: date.id,
          date: date.date,
          points: date.scores[0]?.points || 0,
          extraPoints: date.scores[0]?.extraPoints || 0,
        })),
      })) || []

    return NextResponse.json({ participant: formattedData })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los datos del participante." },
      { status: 500 },
    )
  }
}
