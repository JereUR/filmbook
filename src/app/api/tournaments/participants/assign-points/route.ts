import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"
import { assignPointsSchema } from "@/lib/validation"

export async function POST(req: Request) {
  try {
    const { user, admin } = await validateAdmin()

    if (!admin || !user) {
      return new Response(JSON.stringify({ error: "No autorizado." }), {
        status: 401,
      })
    }

    const body = await req.json()
    const { participantId, tournamentId, dateId, points, extraPoints } =
      assignPointsSchema.parse(body)

    const newParticipantScore = await prisma.participantScore.upsert({
      where: {
        participantId_tournamentDateId: {
          participantId,
          tournamentDateId: dateId,
        },
      },
      create: {
        points,
        extraPoints,
        participantId,
        tournamentDateId: dateId,
        tournamentId
      },
      update: {
        points,
        extraPoints,
      },
      include: {
        participant: true,
        tournamentDate: true,
      },
    })

    return new Response(JSON.stringify(newParticipantScore), {
      status: 201,
    })
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: "Error al asignar puntos al participante." }),
      {
        status: 500,
      },
    )
  }
}
