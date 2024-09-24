"use client";

import { Clapperboard, BadgePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ShowAppRating from "./ShowAppRating";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import RatingEditor from "./RatingEditor";

interface RatingsSectionProps {
  movieId:string
  rating: any;
  voteAverage?: number;
  voteCount?: number;
}

export default function RatingsSection({
  movieId,
  rating,
  voteAverage,
  voteCount,
}: RatingsSectionProps) {
  const [showRatingEditor, setShowRatingEditor] = useState<boolean>(false);

  return (
    <div className="my-2 flex w-full flex-col gap-4 rounded-2xl border border-primary/50 p-2 md:my-4 md:w-1/4 md:gap-3 md:p-4">
      <div className="flex items-center justify-around gap-4">
        <h1 className="text-lg font-semibold md:text-xl">RATING</h1>
        <Button
          variant="ghost"
          className="group flex items-start gap-2 rounded-2xl border border-primary p-2 text-sm hover:bg-primary/80"
          onClick={()=>setShowRatingEditor(true)}
        >
          <Clapperboard className="h-6 w-6" />
          <BadgePlus className="h-[14px] w-[14px] transition-transform duration-300 ease-in-out group-hover:scale-125" />
        </Button>
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
        <DialogContent className="z-[110] p-0">
          <RatingEditor movieId={movieId}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}
