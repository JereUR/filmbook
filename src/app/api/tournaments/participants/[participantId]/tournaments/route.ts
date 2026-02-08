import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateAdmin } from "@/auth"
import {
  ParticipantTournamentsResponse,
  TournamentParticipantData,
} from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ participantId: string }> },
): Promise<NextResponse<ParticipantTournamentsResponse | { error: string }>> {
  const { participantId } = await params
  const { user, admin } = await validateAdmin()
  if (!user || !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const tournaments = await prisma.participant.findFirst({
      where: { id: participantId },
      select: {
        tournaments: {
          select: {
            tournament: {
              select: {
                id: true,
                name: true,
                dates: {
                  orderBy: {
                    date: "desc",
                  },
                  select: {
                    id: true,
                    date: true,
                    name: true,
                    movie: {
                      select: {
                        id: true,
                        title: true,
                        posterPath: true,
                      },
                    },
                    scores: {
                      where: { participantId: participantId },
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
      tournaments?.tournaments.map((tournament) => ({
        tournamentId: tournament.tournament.id,
        tournamentName: tournament.tournament.name,
        dates: tournament.tournament.dates.map((date) => ({
          dateId: date.id,
          date: date.date,
          name: date.name,
          movie: date.movie,
          points: date.scores[0]?.points || 0,
          extraPoints: date.scores[0]?.extraPoints || 0,
        })),
      })) || []

    return NextResponse.json({ tournaments: formattedData })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los datos del participante." },
      { status: 500 },
    )
  }
}
