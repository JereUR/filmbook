import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateAdmin } from "@/auth"
import { ParticipantTournament, TournamentPosition } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { participantId: string } },
) {
  const { user: loggedInUser, admin } = await validateAdmin()

  if (!loggedInUser && !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const participant = await prisma.participant.findUnique({
    where: {
      id: params.participantId,
    },
    select: {
      id: true,
      name: true,
      username: true,
      tournaments: {
        select: {
          tournament: {
            select: {
              id: true,
              name: true,
              dates: {
                select: {
                  id: true,
                  scores: {
                    select: {
                      participantId: true,
                      points: true,
                    },
                  },
                },
              },
              participants: {
                select: {
                  participantId: true,
                  participant: {
                    select: {
                      id: true,
                      name: true,
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

  if (!participant) {
    return NextResponse.json(null)
  }

  const tournamentPositions: TournamentPosition[] = []

  for (const participantTournament of participant.tournaments) {
    const tournament = participantTournament.tournament

    const totalPoints = tournament.dates.reduce((sum, date) => {
      const participantScore = date.scores.find(
        (score) => score.participantId === participant.id,
      )
      return sum + (participantScore ? participantScore.points : 0)
    }, 0)

    const allParticipants = tournament.participants.map((p) => {
      const totalPointsForParticipant = tournament.dates.reduce((sum, date) => {
        const score = date.scores.find(
          (s) => s.participantId === p.participantId,
        )
        return sum + (score ? score.points : 0)
      }, 0)
      return {
        participantId: p.participantId,
        participantName: p.participant.name,
        totalPoints: totalPointsForParticipant,
      }
    })

    allParticipants.sort((a, b) => b.totalPoints - a.totalPoints)
    const position =
      allParticipants.findIndex((p) => p.participantId === participant.id) + 1

    tournamentPositions.push({
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      totalPoints,
      position,
    })
  }

  const participantData: ParticipantTournament = {
    participantId: participant.id,
    participantName: participant.name,
    participantUsername: participant.username,
    tournaments: tournamentPositions,
  }

  return NextResponse.json(participantData)
}
