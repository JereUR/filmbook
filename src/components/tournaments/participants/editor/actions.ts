import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"
import {
  InputTournamentParticipantProps,
  ParticipantTournament,
} from "@/lib/types"
import { updateTournamentParticipantSchema } from "@/lib/validation"

export async function updateTournamentParticipant(
  input: InputTournamentParticipantProps,
): Promise<ParticipantTournament> {
  const { user, admin } = await validateAdmin()

  if (!user || !admin) throw new Error("No autorizado.")

  const { id, name, username, tournamentsId } =
    updateTournamentParticipantSchema.parse(input)

  const updatedParticipant = await prisma.participant.update({
    where: { id },
    data: {
      name,
      username,
      tournaments: {
        set: [],
        connect: tournamentsId?.map((tournamentId) => ({
          participantId_tournamentId: { participantId: id, tournamentId },
        })),
      },
    },
    include: {
      tournaments: {
        include: {
          tournament: {
            include: {
              dates: {
                include: {
                  scores: {
                    select: {
                      participantId: true,
                      points: true,
                    },
                  },
                },
              },
              participants: {
                include: {
                  participant: {
                    select: {
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

  return {
    participantId: updatedParticipant.id,
    participantName: updatedParticipant.name,
    participantUsername: updatedParticipant.username,
    tournaments: updatedParticipant.tournaments.map((participantTournament) => {
      const scores = participantTournament.tournament.dates.flatMap((date) =>
        date.scores.filter(
          (score) => score.participantId === updatedParticipant.id,
        ),
      )

      const totalPoints = scores.reduce((acc, score) => acc + score.points, 0)

      const allScores = participantTournament.tournament.dates.flatMap(
        (date) => date.scores,
      )

      type ScoreMap = { [key: string]: number }
      const sortedScores: ScoreMap = allScores
        .map((score) => ({
          participantId: score.participantId,
          totalPoints: score.points,
        }))
        .reduce((acc, score) => {
          acc[score.participantId] =
            (acc[score.participantId] || 0) + score.totalPoints
          return acc
        }, {} as ScoreMap)

      const sortedParticipants = Object.entries(sortedScores).sort(
        ([, pointsA], [, pointsB]) => pointsB - pointsA,
      )
      const position =
        sortedParticipants.findIndex(
          ([participantId]) => participantId === updatedParticipant.id,
        ) + 1

      return {
        tournamentId: participantTournament.tournamentId,
        tournamentName: participantTournament.tournament.name,
        totalPoints,
        position,
      }
    }),
  }
}

export async function assignPointsToParticipant(
  participantId: string,
  tournamentDateId: string,
  points: number,
  extraPoints?: number,
) {
  const existingScore = await prisma.participantScore.findUnique({
    where: {
      participantId_tournamentDateId: {
        participantId,
        tournamentDateId,
      },
    },
  })

  if (existingScore) {
    return await prisma.participantScore.update({
      where: {
        id: existingScore.id,
      },
      data: {
        points,
        extraPoints,
      },
    })
  } else {
    return await prisma.participantScore.create({
      data: {
        points,
        extraPoints,
        participantId,
        tournamentDateId,
      },
    })
  }
}

export async function deleteTournamentParticipant(
  input: InputTournamentParticipantProps,
) {
  const { user, admin } = await validateAdmin()

  if (!user || !admin) throw Error("No autorizado.")

  const { id } = updateTournamentParticipantSchema.parse(input)

  const deletedParticipant = await prisma.participant.delete({
    where: { id },
  })

  return deletedParticipant
}
