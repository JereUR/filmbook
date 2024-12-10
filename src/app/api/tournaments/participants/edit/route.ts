import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"

interface RequestBody {
  id: string
  name?: string
  username?: string
  nickname?: string
  tournamentsId?: string[]
}

export async function POST(req: Request) {
  try {
    const { user, admin } = await validateAdmin()

    if (!admin || !user) {
      return new Response(JSON.stringify({ error: "No autorizado." }), {
        status: 401,
      })
    }

    const { id, name, username, nickname, tournamentsId } =
      (await req.json()) as RequestBody

    const existingParticipant = await prisma.participant.findUnique({
      where: { id },
    })

    if (!existingParticipant) {
      return new Response(
        JSON.stringify({ error: "Participante no encontrado." }),
        {
          status: 404,
        },
      )
    }

    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: {
        name,
        username,
        nickname,
        tournaments: {
          deleteMany: {},
          create: tournamentsId?.map((tournamentId) => ({
            tournament: {
              connect: { id: tournamentId },
            },
          })),
        },
      },
      include: {
        tournaments: true,
      },
    })

    return new Response(JSON.stringify(updatedParticipant), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al actualizar el participante." }),
      {
        status: 500,
      },
    )
  }
}
