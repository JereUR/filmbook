import { useMutation } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"

export const useAddPrediction = () => {
  return useMutation({
    mutationFn: async (prediction: {
      category: string
      predictedWinner: string
      favoriteWinner: string
    }) => {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prediction),
      })
      if (!response.ok) {
        throw new Error("Failed to add prediction")
      }
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Predicción guardada",
        description: "Tu predicción ha sido guardada exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description:
          "Hubo un problema al guardar tu predicción. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    },
  })
}
