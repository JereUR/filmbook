import { Eye, Heart, ListCheck, ListPlus, Loader2 } from "lucide-react";

import "./styles.css";
import { useEffect, useState } from "react";
import { useSession } from "@/app/(main)/SessionProvider";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface ButtonActionsProps {
  movieId: string;
}

export default function ButtonActions({ movieId }: ButtonActionsProps) {
  const [watched, setWatched] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [addToWatchlist, setAddToWatchlist] = useState<boolean>(false);

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
    if (movieStates?.watched) {
      setWatched(true);
    }
    if (movieStates?.like) {
      setLiked(true);
    }
  }, [movieStates]);

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
          className={`icon-fine h-10 w-10 cursor-pointer ${liked ? "fill-primary text-background" : "text-muted-foreground"}`}
          onClick={() => setLiked(!liked)}
        />
        {isLoadingMovieStates || isFecthingMovieStates ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <span className="mt-1 text-sm font-semibold">Me gusta</span>
        )}
      </div>
      <div className="flex flex-col items-center">
        {addToWatchlist ? (
          <ListCheck
            className="h-10 w-10 scale-110 transform cursor-pointer text-green-600 transition duration-300 ease-in-out"
            onClick={() => setAddToWatchlist(false)}
          />
        ) : (
          <ListPlus
            className="h-10 w-10 scale-100 transform cursor-pointer text-muted-foreground transition duration-300 ease-in-out"
            onClick={() => setAddToWatchlist(true)}
          />
        )}
        <span className="mt-1 text-sm font-semibold">Watchlist</span>
      </div>
    </div>
  );
}
