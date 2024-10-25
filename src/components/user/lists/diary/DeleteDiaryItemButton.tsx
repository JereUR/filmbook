import { useState } from "react";
import { Trash2 } from "lucide-react";

import { DiaryInfo } from "@/lib/types";
import DeleteDiaryItemDialog from "./DeleteDiaryItemDialog";

interface DeleteDiaryItemButtonProps {
  diary: DiaryInfo;
  className?: string;
}

export default function DeleteDiaryItemButton({
  diary,
  className,
}: DeleteDiaryItemButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  return (
    <div>
      <button className='absolute top-5 right-5 p-2 hover:bg-card-child/40 rounded' onClick={() => setShowDeleteDialog(true)}><Trash2 className="text-destructive h-3 w-3 md:h-4 md:w-4" /></button>
      <DeleteDiaryItemDialog
        diaryItem={diary}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
