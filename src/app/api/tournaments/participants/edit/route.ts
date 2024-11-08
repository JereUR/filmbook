import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"

interface RequestBody {
  id: string
  name: string
  username?: string
  tournamentsId: string[]
}

export async function POST(req: Request) {
  try {
    const { user, admin } = await validateAdmin()

    if (!admin || !user) {
      return new Response(JSON.stringify({ error: "No autorizado." }), {
        status: 401,
      })
    }

    const { id, name, username, tournamentsId } =
      (await req.json()) as RequestBody

    const participant = await prisma.participant.update({
      where: { id },
      data: {
        name,
        username: username || name.toLowerCase().replace(/\s+/g, "-"),
        tournaments: {
          create: tournamentsId.map((tournamentId) => {
            return {
              tournament: {
                connect: { id: tournamentId },
              },
            }
          }),
        },
      },
      include: {
        tournaments: true,
      },
    })

    return new Response(JSON.stringify(participant), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: "Error al editar el participante." }),
      {
        status: 500,
      },
    )
  }
}
