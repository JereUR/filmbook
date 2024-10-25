"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

export async function deleteDiaryItem(id: string) {
  const { user } = await validateRequest()

  if (!user) throw new Error("No autorizado.")

  const diaryItem = await prisma.diary.findUnique({
    where: {
      id,
    },
  })

  if (!diaryItem) throw new Error("Película de bitácora no encontrada.")

  if (diaryItem.userId !== user.id)
    throw new Error("No tienes permisos para removar esta película.")

  const deletedDiaryItem = await prisma.diary.delete({
    where: { id },
  })

  return deletedDiaryItem
}
