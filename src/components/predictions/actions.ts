"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { type PredictionInput, predictionsArraySchema } from "@/lib/validation"
import { revalidatePath } from "next/cache"

export async function addPredictions(values: PredictionInput[]) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  console.log("Valores recibidos en addPredictions:", values)

  if (values.length === 0) {
    throw new Error("No hay predicciones para guardar")
  }

  // Todos los valores tienen el mismo eventId, así que usamos el primero
  const [eventName, eventYear] = values[0].eventId.split("-")

  const awardEvent = await prisma.awardEvent.findFirst({
    where: {
      name: eventName,
      year: Number.parseInt(eventYear),
    },
  })

  if (!awardEvent) throw new Error("Award event not found")

  try {
    const validatedData = predictionsArraySchema.parse(values)
    console.log("Datos validados:", validatedData)

    // Usar una transacción para asegurar que todas las predicciones se guarden o ninguna
    const predictions = await prisma.$transaction(
      validatedData.map((prediction) =>
        prisma.prediction.create({
          data: {
            userId: user.id,
            awardEventId: awardEvent.id,
            category: prediction.category,
            predictedWinnerName: prediction.predictedWinnerName,
            predictedWinnerImage: prediction.predictedWinnerImage,
            favoriteWinnerName: prediction.favoriteWinnerName,
            favoriteWinnerImage: prediction.favoriteWinnerImage,
          },
        }),
      ),
    )

    console.log("Predicciones creadas:", predictions)
    revalidatePath("/mis-predicciones")
    return predictions
  } catch (error) {
    console.error("Error en addPredictions:", error)
    throw error
  }
}

export async function updatePredictions(values: PredictionInput[]) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  if (values.length === 0) {
    throw new Error("No hay predicciones para actualizar")
  }

  const [eventName, eventYear] = values[0].eventId.split("-")

  const awardEvent = await prisma.awardEvent.findFirst({
    where: {
      name: eventName,
      year: Number.parseInt(eventYear),
    },
  })

  if (!awardEvent) throw new Error("Award event not found")

  try {
    const validatedData = predictionsArraySchema.parse(values)

    /* const predictions = await prisma.$transaction(
      validatedData.map(async (prediction) => {
        const existingPrediction = await prisma.prediction.findFirst({
          where: {
            userId: user.id,
            awardEventId: awardEvent.id,
            category: prediction.category,
          },
        })

        if (!existingPrediction) {
          return prisma.prediction.create({
            data: {
              userId: user.id,
              awardEventId: awardEvent.id,
              category: prediction.category,
              predictedWinnerName: prediction.predictedWinnerName,
              predictedWinnerImage: prediction.predictedWinnerImage,
              favoriteWinnerName: prediction.favoriteWinnerName,
              favoriteWinnerImage: prediction.favoriteWinnerImage,
            },
          })
        }

        return prisma.prediction.update({
          where: {
            id: existingPrediction.id,
          },
          data: {
            predictedWinnerName: prediction.predictedWinnerName,
            predictedWinnerImage: prediction.predictedWinnerImage,
            favoriteWinnerName: prediction.favoriteWinnerName,
            favoriteWinnerImage: prediction.favoriteWinnerImage,
          },
        })
      }),
    ) */

    revalidatePath("/mis-predicciones")
    return []
  } catch (error) {
    console.error("Error en updatePredictions:", error)
    throw error
  }
}

export async function deletePredictions(userId: string, eventId: string) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  const [eventName, eventYear] = eventId.split("-")

  await prisma.prediction.deleteMany({
    where: {
      userId: userId,
      awardEvent: {
        name: eventName,
        year: Number.parseInt(eventYear),
      },
    },
  })

  revalidatePath("/mis-predicciones")
}

export async function getPredictions(userId: string) {
  const predictions = await prisma.prediction.findMany({
    where: {
      userId: userId,
    },
    include: {
      awardEvent: true,
    },
    orderBy: [
      { awardEvent: { year: "desc" } },
      { awardEvent: { name: "asc" } },
      { category: "asc" },
    ],
  })

  const groupedPredictions = predictions.reduce(
    (acc, prediction) => {
      const eventKey = `${prediction.awardEvent.name}-${prediction.awardEvent.year}`
      if (!acc[eventKey]) {
        acc[eventKey] = {
          name: prediction.awardEvent.name,
          year: prediction.awardEvent.year,
          categories: {},
        }
      }
      acc[eventKey].categories[prediction.category] = {
        id: prediction.id,
        predictedWinnerName: prediction.predictedWinnerName,
        predictedWinnerImage: prediction.predictedWinnerImage,
        favoriteWinnerName: prediction.favoriteWinnerName,
        favoriteWinnerImage: prediction.favoriteWinnerImage,
      }
      return acc
    },
    {} as Record<
      string,
      { name: string; year: number; categories: Record<string, any> }
    >,
  )

  return Object.values(groupedPredictions)
}
