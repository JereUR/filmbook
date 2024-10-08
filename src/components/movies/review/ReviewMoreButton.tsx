import { useState } from "react";
import { Edit2, MoreHorizontal, Trash2, Share2 } from "lucide-react";

import { ReviewInfo } from "@/lib/types";
import DeleteReviewDialog from "./DeleteReviewDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/(main)/SessionProvider";

interface ReviewMoreButtonProps {
  review: ReviewInfo;
  className?: string;
}

export default function ReviewMoreButton({
  review,
  className,
}: ReviewMoreButtonProps) {
  const {user} = useSession()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  console.log({review})

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
    </div>
  );
}
