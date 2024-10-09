import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Edit2, MoreHorizontal, Trash2, Share2 } from "lucide-react";

import { ReviewInfo, ReviewData } from "@/lib/types";
import DeleteReviewDialog from "./DeleteReviewDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/(main)/SessionProvider";
import EditReviewDialog from "./EditReviewDialog";
import { useRouter } from "next/navigation";

interface ReviewMoreButtonProps {
  review: ReviewInfo;
  reviewWasChanged: boolean
  setReviewWasChanged: Dispatch<SetStateAction<boolean>>
  className?: string;
}

export default function ReviewMoreButton({
  review,
  reviewWasChanged,
  setReviewWasChanged,
  className,
}: ReviewMoreButtonProps) {
  const { user } = useSession()
  const [reviewState, setReviewState] = useState<ReviewData>({
    id: review.id,
    rating: review.rating || null,
    review: review.review || "",
    watched: review.watched || false,
    liked: review.liked || false,
  })
  const [showReviewEditor, setShowReviewEditor] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const { movieId } = review
  const router = useRouter()

  async function fetchNewReview() {
    const response = await fetch(`/api/movie/review/movie/${movieId}`)
    const data = await response.json()

    if (data as ReviewData) {
      setReviewState(data)
    }
  }

  useEffect(() => {
    if (reviewWasChanged) {
      fetchNewReview().then(() => setReviewWasChanged(false));
    }
  }, [reviewWasChanged]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
          >
            <span className="flex items-center gap-3 font-bold text-foreground">
              <Share2 className="size-4" />
              Compartir
            </span>
          </DropdownMenuItem>
          {user.id === review.userId && (<div><DropdownMenuItem
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
            </DropdownMenuItem></div>)}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteReviewDialog
        review={review}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
      <EditReviewDialog reviewState={reviewState} movieId={movieId || ''} activateRefresh={() => router.refresh()} onClose={() => setShowReviewEditor(false)} open={showReviewEditor} />
    </div>
  );
}
