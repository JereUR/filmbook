import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PostEditor from "@/components/posts/editor/PostEditor";
import { generateReviewShareText } from "@/lib/utils";

interface SharePostReviewDialogProps {
  open: boolean;
  onClose: () => void;
  username: string;
  reviewId: string;
  rating: number | null;
  movie: {
    movieId: string | undefined;
    title: string;
    year: string;
  };
}

export default function SharePostReviewDialog({
  open,
  onClose,
  reviewId,
  rating,
  username,
  movie,
}: SharePostReviewDialogProps) {
    const text = generateReviewShareText(
    reviewId,
    username,
    rating,
    movie,
  );

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }
  console.log(text)
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Postear review</DialogTitle>
        </DialogHeader>
          <PostEditor initialContent={text} />
      </DialogContent>
    </Dialog>
  );
}
