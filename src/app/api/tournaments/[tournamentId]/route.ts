import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateAdmin } from "@/auth"
import { Tournament, TournamentDate } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { tournamentId: string } },
) {
  /* 
  const { user, admin } = await validateAdmin()

  if (!user && !admin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }
 */
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: params.tournamentId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      participants: {
        select: {
          participant: {
            select: {
              id: true,
              name: true,
              username: true,
              scores: {
                select: {
                  points: true,
                  extraPoints: true,
                  tournamentDate: {
                    select: {
                      tournamentId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      dates: {
        select: {
          id: true,
          date: true,
          movie: {
            select: {
              id: true,
              title: true,
            },
          },
          scores: {
            select: {
              participant: {
                select: {
                  id: true,
                  name: true,
                },
              },
              points: true,
              extraPoints: true,
            },
          },
        },
      },
    },
  })

  if (!tournament) {
    return NextResponse.json(null)
  }

  const participantsWithPoints = tournament.participants.map((p) => {
    const totalPoints = p.participant.scores.reduce((acc, score) => {
      return acc + score.points + (score.extraPoints || 0)
    }, 0)

    return {
      participantId: p.participant.id,
      participantName: p.participant.name,
      participantUsername: p.participant.username,
      totalPoints,
      tournaments: [
        {
          tournamentId: tournament.id,
          tournamentName: tournament.name,
          totalPoints: totalPoints,
          position: 0,
        },
      ],
    }
  })

  const sortedParticipants = participantsWithPoints
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((participant, index) => ({
      ...participant,
      tournaments: participant.tournaments.map((tournamentData) => ({
        ...tournamentData,
        position: index + 1,
      })),
    }))

  const dates: TournamentDate[] = tournament.dates.map((d) => ({
    id: d.id,
    date: d.date,
    movie: {
      id: d.movie.id,
      title: d.movie.title,
    },
    scores: d.scores.map((s) => ({
      participantId: s.participant.id,
      participantName: s.participant.name,
      points: s.points,
      extraPoints: s.extraPoints || 0,
    })),
  }))

  const tournamentData: Tournament = {
    id: tournament.id,
    name: tournament.name,
    description: tournament.description,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    participants: sortedParticipants,
    dates,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
  }

  return NextResponse.json(tournamentData)
}
