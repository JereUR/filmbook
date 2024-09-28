import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";

import { LikedInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  movieId: string;
  initialState: LikedInfo;
}

export default function LikeButton({
  movieId,
  initialState,
}: LikeButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["like-info", movieId];

  const { data: likeData, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/movie/liked/${movieId}`).json<LikedInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      likeData?.isLikedByUser
        ? kyInstance.delete(`/api/movie/liked/${movieId}`)
        : kyInstance.post(`/api/movie/liked/${movieId}`),
    onMutate: async () => {
      toast({
        description: `Película ${
          likeData?.isLikedByUser
            ? "desmarcada como favorita"
            : "marcada como favorita"
        }`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikedInfo>(queryKey);

      queryClient.setQueryData<LikedInfo>(queryKey, () => ({
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Error al intentar actualizar tu watchlist.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <div className="flex flex-col items-center">
      <Heart
        className={cn(
          "icon-fine h-10 w-10 cursor-pointer",
          likeData?.isLikedByUser
            ? "fill-red-500 dark:fill-red-600 text-background"
            : "text-muted-foreground",
        )}
        onClick={() => mutate()}
      />
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : (
        <span className="mt-1 text-sm font-semibold">Me gusta</span>
      )}
    </div>
  );
}
