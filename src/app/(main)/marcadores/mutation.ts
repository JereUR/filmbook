import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteWatchlistItem } from "./actions";
import { WatchlistPage } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "../SessionProvider";

export function useDeleteWatchlistItemMutation() {
  const { toast } = useToast();
  const { user } = useSession();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteWatchlistItem,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["watchlist", user.id] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<WatchlistPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              watchlist: page.watchlist.filter((p) => p.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({
        description: "Película removida de tu watchlist.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          "Error al remover película de la watchlist. Por favor vuelve a intentarlo.",
      });
    },
  });

  return mutation;
}
