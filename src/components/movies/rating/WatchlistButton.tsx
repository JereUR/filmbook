import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { BookmarkPlus } from "lucide-react";

import { BookmarkInfo, WatchlistInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  movieId: string;
  initialState: WatchlistInfo;
}

export default function WatchlistButton({
  movieId,
  initialState,
}: WatchlistButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["watchlist-info", movieId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/movie/watchlist/${movieId}`).json<WatchlistInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isAddToWatchlistByUser
        ? kyInstance.delete(`/api/movie/watchlist/${movieId}`)
        : kyInstance.post(`/api/movie/watchlist/${movieId}`),
    onMutate: async () => {
      toast({
        description: `Película ${data.isAddToWatchlistByUser ? "eliminada de watchlist" : "agregada a watchlist"}`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<WatchlistInfo>(queryKey);

      queryClient.setQueryData<WatchlistInfo>(queryKey, () => ({
        isAddToWatchlistByUser: !previousState?.isAddToWatchlistByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Error al intentar agregar la película a tu watchlist.",
      });
    },
  });

  return (
    <div className="flex flex-col items-center">
      <button onClick={() => mutate()} className="flex items-center gap-2 border-none">
        <BookmarkPlus
          className={cn(
            "icon-fine h-10 w-10 cursor-pointer",
            data.isAddToWatchlistByUser
              ? "fill-primary text-background"
              : "text-muted-foreground",
          )}
        />
      </button>
      <span className="mt-1 text-sm font-semibold">Watchlist</span>
    </div>
  );
}
