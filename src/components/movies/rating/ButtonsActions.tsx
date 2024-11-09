import WatchlistButton from "./WatchlistButton"
import { useSession } from "@/app/(main)/SessionProvider"
import WatchedButton from "./WatchedButton"
import LikeButton from "./LikeButton"
import { ReviewInfo } from "@/lib/types"

interface ButtonActionsProps {
  movieId: string
  watchlist: { userId: string; movieId: string }[]
  reviews: ReviewInfo[]
  activateRefresh: () => void
}

export default function ButtonActions({
  movieId,
  watchlist,
  reviews,
  activateRefresh
}: ButtonActionsProps) {
  const { user } = useSession()

  if (!user) return

  const isWatchedByUser = reviews
    ? reviews.some(
      (movie) =>
        movie.userId === user.id &&
        movie.movieId === movieId &&
        movie.watched
    )
    : false

  const isLikedByUser = reviews
    ? reviews.some(
      (movie) =>
        movie.userId === user.id &&
        movie.movieId === movieId &&
        movie.liked,
    )
    : false

  const isInWatchlistByUser = watchlist
    ? watchlist.some(
      (movie) => movie.userId === user.id && movie.movieId === movieId,
    )
    : false

  return (
    <div className="flex justify-around">
      <WatchedButton
        movieId={movieId}
        initialState={{
          isWatchedByUser
        }}
        activateRefresh={activateRefresh}
      />
      <LikeButton
        movieId={movieId}
        initialState={{
          isLikedByUser,
        }}
        activateRefresh={activateRefresh}
      />
      <WatchlistButton
        movieId={movieId}
        initialState={{
          isAddToWatchlistByUser: isInWatchlistByUser,
        }}
      />
    </div>
  )
}
