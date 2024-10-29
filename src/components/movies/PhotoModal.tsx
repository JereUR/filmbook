import Image from "next/image"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ImageInfo } from "@/lib/types"

interface PhotoModalProps {
  isOpen: boolean
  image: ImageInfo | null
  onClose: () => void
}

export default function PhotoModal({
  isOpen,
  image,
  onClose,
}: PhotoModalProps) {
  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='p-0 z-[110]'>
        <Image
          src={image.src}
          alt={`${image.name} image`}
          width={720}
          height={480}
          className="overflow-hidden rounded-lg shadow-lg"
        />
      </DialogContent>
    </Dialog>
  )
}
