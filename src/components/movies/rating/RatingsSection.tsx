"use client";

import { CirclePlus } from "lucide-react";
import { useState } from "react";

import "./styles.css";
import ShowAppRating from "./ShowAppRating";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getYear } from "@/lib/utils";
import ButtonActions from "./ButtonsActions";
import { ReviewInfo } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";
import ReviewEditor from "./ReviewEditor";

interface RatingsSectionProps {
  movieId: string;
  title: string;
  releaseDate: Date | undefined;
  rating: any;
  voteAverage?: number;
  voteCount?: number;
  watchlist: { userId: string; movieId: string }[];
  reviews: ReviewInfo[];
}

export default function RatingsSection({
  movieId,
  title,
  releaseDate,
  rating,
  voteAverage,
  voteCount,
  watchlist,
  reviews,
}: RatingsSectionProps) {
  const [showRatingEditor, setShowRatingEditor] = useState<boolean>(false);
  const { user } = useSession()

  const ownReview = reviews.find(review => review.movieId === movieId && review.userId === user.id)

  const ownRating = ownReview ? ownReview.rating : null
  const reviewText = ownReview ? ownReview.review : null

  return (
    <div className="my-2 flex w-full flex-col gap-4 rounded-2xl border border-primary/50 p-2 md:my-4 md:w-1/4 md:gap-3 md:p-4">
      <div className="flex items-center justify-around gap-4">
        <h1 className="text-lg font-semibold md:text-xl">RATING</h1>
        <CirclePlus
          className="icon-fine h-12 w-12 cursor-pointer fill-green-600 text-muted transition duration-300 ease-in-out hover:scale-110"
          onClick={() => {
            setShowRatingEditor(true);
          }}
        />
      </div>
      <div className="flex justify-center gap-2 md:flex-col">
        <div className="flex border-r pr-8 md:flex-col md:border-b md:border-r-0 md:pb-4 md:pr-0">
          <ShowAppRating
            ownApp={false}
            voteAverage={voteAverage}
            voteCount={voteCount}
          />
        </div>
        <div>
          <ShowAppRating
            ownApp={true}
            voteAverage={rating ? rating.averageRating : undefined}
            voteCount={rating ? rating.numberOfRatings : undefined}
            className="pl-5 md:pl-0 md:pt-1"
          />
        </div>
      </div>
      <Dialog
        open={showRatingEditor}
        onOpenChange={() => setShowRatingEditor(false)}
      >
        <DialogTitle />
        <DialogContent className="z-[110] rounded-2xl border-primary/40 p-4">
          <div className="ml-1 flex flex-col">
            <h1 className="font-semibold text-foreground">{title}</h1>
            <p className="font-light text-foreground/40">
              {getYear(releaseDate ? `${releaseDate.toString()}` : "")}
            </p>
          </div>
          <hr className="-my-1 h-[1px] border-none bg-primary/40" />
          <ButtonActions
            movieId={movieId}
            watchlist={watchlist}
            reviews={reviews}
          />
          <hr className="-my-1 h-[1px] border-none bg-primary/40" />
          <ReviewEditor movieId={movieId} ownRating={ownRating} reviewText={reviewText}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}
