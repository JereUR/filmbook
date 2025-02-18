import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPrediction, updatePrediction, deletePredictions } from "./actions"
import { useRouter } from "next/navigation"

type PredictionInput = {
  userId: string
  eventId: string
  category: string
  predictedWinnerName: string
  predictedWinnerImage: string | null
  favoriteWinnerName: string
  favoriteWinnerImage: string | null
}

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
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Hubo un problema al guardar tu predicción. Por favor, intenta de nuevo.",
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
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Hubo un problema al actualizar tu predicción. Por favor, intenta de nuevo.",
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
    onError: () => {
      toast({
        variant: "destructive",
        description:
          "Hubo un problema al eliminar las predicciones. Por favor, intenta de nuevo.",
      })
    },
  })
}
