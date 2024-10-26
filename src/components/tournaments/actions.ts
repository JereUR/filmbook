"use server"

import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"

export async function deleteTournament(id: string) {
  const { user, admin } = await validateAdmin()

  if (!user || !admin) throw new Error("No autorizado.")

  const tournament = await prisma.tournament.findUnique({
    where: {
      id,
    },
  })

  if (!tournament) throw new Error("Torneo no encontrado.")

  const deletedTournament = await prisma.tournament.delete({
    where: { id },
  })

  return deletedTournament
}
