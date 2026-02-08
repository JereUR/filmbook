"use server"

import { validateAdmin } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- Award Events ---

export async function createAwardEvent(data: {
  name: string
  active: boolean
}) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  const event = await prisma.awardEvent.create({
    data,
  })

  revalidatePath("/gestion-premios")
  return event
}

export async function updateAwardEvent(
  id: string,
  data: { name?: string; active?: boolean },
) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  const event = await prisma.awardEvent.update({
    where: { id },
    data,
  })

  revalidatePath("/gestion-premios")
  return event
}

export async function deleteAwardEvent(id: string) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  await prisma.awardEvent.delete({
    where: { id },
  })

  revalidatePath("/gestion-premios")
}

// --- Categories ---

export async function createCategory(data: {
  name: string
  eventIds: string[]
}) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  const category = await prisma.category.create({
    data: {
      name: data.name,
      events: {
        connect: data.eventIds.map((id) => ({ id })),
      },
    },
  })

  revalidatePath("/gestion-premios")
  return category
}

export async function updateCategory(
  id: string,
  data: { name?: string; winnerId?: string | null; eventIds?: string[] },
) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  const updateData: any = {
    name: data.name,
    winnerId: data.winnerId,
  }

  if (data.eventIds) {
    updateData.events = {
      set: data.eventIds.map((id) => ({ id })),
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: updateData,
  })

  revalidatePath("/gestion-premios")
  return category
}

export async function deleteCategory(id: string) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  await prisma.category.delete({
    where: { id },
  })

  revalidatePath("/gestion-premios")
}

// --- Nominees ---

export async function createNominee(data: {
  name: string
  categoryId: string
  movieId?: string
  movieTitle?: string
  photo?: string
  providers?: any
  composers?: string
}) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  const nominee = await prisma.nominee.create({
    data,
  })

  revalidatePath("/gestion-premios")
  return nominee
}

export async function updateNominee(
  id: string,
  data: {
    name?: string
    categoryId?: string
    movieId?: string
    movieTitle?: string
    photo?: string
    providers?: any
    composers?: string
  },
) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  const nominee = await prisma.nominee.update({
    where: { id },
    data,
  })

  revalidatePath("/gestion-premios")
  return nominee
}

export async function deleteNominee(id: string) {
  const { admin } = await validateAdmin()
  if (!admin) throw new Error("Unauthorized")

  await prisma.nominee.delete({
    where: { id },
  })

  revalidatePath("/gestion-premios")
}
