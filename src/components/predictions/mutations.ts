"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { PredictionInput } from "@/lib/validation"
import { addPrediction, deletePredictions, updatePrediction } from "./actions"
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "@/lib/exceptions"

export function useAddPredictionMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<void, Error, PredictionInput>({
    mutationFn: addPrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] })
      toast({
        description: "Predicción guardada exitosamente.",
      })
      router.push("/mis-predicciones")
    },
    onError: (error) => {
      let message =
        "Hubo un problema al guardar tu predicción. Por favor, intenta de nuevo."

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

export function useUpdatePredictionMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<void, Error, PredictionInput>({
    mutationFn: updatePrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] })
      toast({
        description: "Predicción actualizada exitosamente.",
      })
      router.push("/mis-predicciones")
    },
    onError: (error) => {
      let message =
        "Hubo un problema al actualizar tu predicción. Por favor, intenta de nuevo."

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
