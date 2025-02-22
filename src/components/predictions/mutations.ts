"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { PredictionInput } from "@/lib/validation"
import { addPredictions, updatePredictions, deletePredictions } from "./actions"
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "@/lib/exceptions"

type Prediction = {
  id: string
  userId: string
  category: string
  predictedWinnerName: string
  predictedWinnerImage: string | null
  favoriteWinnerName: string
  favoriteWinnerImage: string | null
  awardEventId: string
  createdAt: Date
  updatedAt: Date
}

export function useAddPredictionsMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<Prediction[], Error, PredictionInput[]>({
    mutationFn: addPredictions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] })
      toast({
        description: "Predicciones guardadas exitosamente.",
      })
      router.push("/mis-predicciones")
    },
    onError: (error) => {
      let message =
        "Hubo un problema al guardar tus predicciones. Por favor, intenta de nuevo."

      if (error instanceof ValidationError) {
        message = error.message
      } else if (error instanceof AuthorizationError) {
        message = "No tienes permiso para realizar esta acción."
        router.push("/login")
      } else if (error instanceof NotFoundError) {
        message = error.message
      }

      toast({
        variant: "destructive",
        description: message,
      })
    },
  })
}

export function useUpdatePredictionsMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<Prediction[], Error, PredictionInput[]>({
    mutationFn: updatePredictions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] })
      toast({
        description: "Predicciones actualizadas exitosamente.",
      })
      router.push("/mis-predicciones")
    },
    onError: (error) => {
      let message =
        "Hubo un problema al actualizar tus predicciones. Por favor, intenta de nuevo."

      if (error instanceof ValidationError) {
        message = error.message
      } else if (error instanceof AuthorizationError) {
        message = "No tienes permiso para realizar esta acción."
        router.push("/login")
      }

      toast({
        variant: "destructive",
        description: message,
      })
    },
  })
}

export function useDeletePredictionsMutation(userId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (eventId: string) => deletePredictions(userId, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] })
      toast({
        description: "Predicciones eliminadas exitosamente.",
      })
    },
    onError: (error) => {
      let message =
        "Hubo un problema al eliminar las predicciones. Por favor, intenta de nuevo."

      if (error instanceof ValidationError) {
        message = error.message
      } else if (error instanceof AuthorizationError) {
        message = "No tienes permiso para realizar esta acción."
      }

      toast({
        variant: "destructive",
        description: message,
      })
    },
  })
}
