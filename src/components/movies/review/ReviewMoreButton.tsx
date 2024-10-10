"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Edit2,
  MoreHorizontal,
  Trash2,
  Share2,
  MessageSquare,
  Twitter,
} from "lucide-react";

import { ReviewInfo, ReviewData } from "@/lib/types";
import DeleteReviewDialog from "./DeleteReviewDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/(main)/SessionProvider";
import EditReviewDialog from "./EditReviewDialog";
import { useRouter } from "next/navigation";
import SharePostReviewDialog from "./SharePostReviewDialog";
import { generateReviewShareTextForTwitter, getYear } from "@/lib/utils";

interface ReviewMoreButtonProps {
  review: ReviewInfo;
  className?: string;
}

export default function ReviewMoreButton({
  review,
  className,
}: ReviewMoreButtonProps) {
  const { user } = useSession();
  const [reviewState, setReviewState] = useState<ReviewData>({
    id: review.id,
    rating: review.rating || null,
    review: review.review || "",
    watched: review.watched || false,
    liked: review.liked || false,
  });
  const [showReviewEditor, setShowReviewEditor] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showSharePostDialog, setShowSharePostDialog] =
    useState<boolean>(false);

  const { movieId } = review;
  const movie = {
    movieId,
    title: review.movie?.title || "",
    year: getYear(
      review.movie.releaseDate ? review.movie.releaseDate.toString() : "",
    ),
  };
  const router = useRouter();

  return (
    <div className="mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <span className="flex items-center gap-3 font-bold text-foreground">
                <Share2 className="size-4" />
                Compartir
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setShowSharePostDialog(true)}
              >
                <span className="flex items-center gap-3 font-bold text-foreground">
                  <MessageSquare className="size-4" />
                  Postear
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  const twitterUrl = generateReviewShareTextForTwitter(
                    review.id,
                    review.user ? review.user.username : "",
                    review.user && review.user.displayName ? review.user.displayName : "",
                    review.rating,
                    user.id === review.userId,
                    movie
                  );
                  window.open(twitterUrl, "_blank");
                }}
              >
                <span className="flex items-center gap-3 font-bold text-foreground">
                  <Twitter className="size-4" />
                  Twitter
                </span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          {user.id === review.userId && (
            <>
              <DropdownMenuItem
                onClick={() => setShowReviewEditor(true)}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-3 font-bold text-foreground">
                  <Edit2 className="size-4 text-sky-600" />
                  Editar
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-3 font-bold text-foreground">
                  <Trash2 className="size-4 text-destructive" />
                  Borrar
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteReviewDialog
        review={review}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
      <EditReviewDialog
        reviewState={reviewState}
        movieId={movieId || ""}
        activateRefresh={() => router.refresh()}
        onClose={() => setShowReviewEditor(false)}
        open={showReviewEditor}
      />
      <SharePostReviewDialog
        open={showSharePostDialog}
        onClose={() => setShowSharePostDialog(false)}
        username={review.user ? review.user.username : ""}
        displayName={
          review.user && review.user.displayName ? review.user.displayName : ""
        }
        rating={review.rating}
        movie={movie}
        reviewId={review.id}
      />
    </div>
  );
}
