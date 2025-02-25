import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { Tournament} from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { tournamentId: string } },
) {
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
              nickname: true,
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
          name: true,
          movie: {
            select: {
              id: true,
              title: true,
              posterPath: true,
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
          visible: true,
          extraPoints: true,
          extraPointsSolution: true,
        },
      },
    },
  })

  if (!tournament) {
    return NextResponse.json(null)
  }

  const participantsWithPoints = tournament.participants
    .map((p) => {
      const totalPoints = p.participant.scores.reduce((acc, score) => {
        return acc + score.points + (score.extraPoints || 0)
      }, 0)

      return {
        participantId: p.participant.id,
        participantName: p.participant.name,
        participantUsername: p.participant.username,
        participantNickname: p.participant.nickname,
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
    .filter((participant) => participant.totalPoints > 0)

  const sortedParticipants = participantsWithPoints
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((participant, index) => ({
      ...participant,
      tournaments: participant.tournaments.map((tournamentData) => ({
        ...tournamentData,
        position: index + 1,
      })),
    }))

  let sortedDates = tournament.dates.sort((a, b) => a.date - b.date)

  let bonusIndex = sortedDates.findIndex((d) => d.name === "Bonus")
  if (bonusIndex !== -1) {
    const [bonus] = sortedDates.splice(bonusIndex, 1)
    const targetIndex = Math.min(29, sortedDates.length)
    sortedDates.splice(targetIndex, 0, bonus)
  }

  const formattedDates = sortedDates.map((d) => ({
    id: d.id,
    date: d.date,
    name: d.name,
    movie: {
      id: d.movie.id,
      title: d.movie.title,
      posterPath: d.movie.posterPath,
    },
    scores: d.scores.map((s) => ({
      participantId: s.participant.id,
      participantName: s.participant.name,
      points: s.points,
      extraPoints: s.extraPoints || 0,
    })),
    visible: d.visible,
    extraPoints: d.extraPoints,
    extraPointsSolution: d.extraPointsSolution,
  }))

  const tournamentData: Tournament = {
    id: tournament.id,
    name: tournament.name,
    description: tournament.description,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    participants: sortedParticipants,
    dates: formattedDates,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
  }

  return NextResponse.json(tournamentData)
}
