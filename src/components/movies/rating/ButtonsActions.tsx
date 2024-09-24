import { cache, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Heart, Loader2 } from "lucide-react";

import kyInstance from "@/lib/ky";
import WatchlistButton from "./WatchlistButton";
import { useSession } from "@/app/(main)/SessionProvider";
import { WatchlistInfo } from "@/lib/types";

interface ButtonActionsProps {
  movieId: string;
  watched: boolean;
  setWatched: (watched: boolean) => void;
  watchlist: { userId: string; movieId: string }[];
}

export default function ButtonActions({
  movieId,
  watched,
  setWatched,
  watchlist,
}: ButtonActionsProps) {
  const [liked, setLiked] = useState<boolean>(false);

  const { user } = useSession();

  const {
    data: movieStates,
    isLoading: isLoadingMovieStates,
    isFetching: isFecthingMovieStates,
  } = useQuery({
    queryKey: ["movie-states", movieId, user?.id],
    queryFn: () =>
      kyInstance
        .get(`/api/movie/watched/${movieId}`)
        .json<{ watched: boolean; like: boolean }>(),
    initialData: { watched: false, like: false },
  });

  useEffect(() => {
    if (movieStates && !isLoadingMovieStates) {
      setWatched(movieStates.watched);
      setLiked(movieStates.like);
    }
  }, [movieStates, isLoadingMovieStates]);

  return (
    <div className="flex justify-around">
      <div className="flex flex-col items-center">
        <Eye
          className={`icon-fine h-10 w-10 cursor-pointer ${watched ? "fill-primary text-background" : "text-muted-foreground"}`}
          onClick={() => setWatched(!watched)}
        />
        {isLoadingMovieStates || isFecthingMovieStates ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <span className="mt-1 text-sm font-semibold">Mirar</span>
        )}
      </div>
      <div className="flex flex-col items-center">
        <Heart
          className={`icon-fine h-10 w-10 cursor-pointer ${liked ? "fill-red-500 text-background dark:fill-red-600" : "text-muted-foreground"}`}
          onClick={() => setLiked(!liked)}
        />
        {isLoadingMovieStates || isFecthingMovieStates ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <span className="mt-1 text-sm font-semibold">Like</span>
        )}
      </div>
      <WatchlistButton
        movieId={movieId}
        initialState={{
          isAddToWatchlistByUser: watchlist
            ? watchlist.some(
                (movie) =>
                  movie.userId === user.id && movie.movieId === movieId,
              )
            : false,
        }}
      />
    </div>
  );
}
