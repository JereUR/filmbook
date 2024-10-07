import Image from "next/image";

import { cn } from "@/lib/utils";
import noImage from "@/assets/avatar-placeholder.png";
import { ImageInfo } from "@/lib/types";

interface CircularImageProps {
  src: string | null | undefined;
  size?: number;
  alt: string;
  className?: string;
  handleImageClick?: (image: ImageInfo) => void
  transform?: boolean
}

export default function CircularImage({
  src,
  size,
  handleImageClick,
  alt,
  className,
  transform = true
}: CircularImageProps) {
  const image: ImageInfo = {
    src: src ? src : noImage,
    name: alt
  }

  return (
    <div
      style={{ width: `${size ?? 38}px`, height: `${size ?? 38}px` }}
      className={cn(
        "overflow-hidden rounded-full ring ring-primary/50",
        className,
      )}
    >
      <Image
        src={src ? src : noImage}
        width={size ?? 38}
        height={size ?? 38}
        alt={alt}
        aria-label={alt}
        className={`object-cover cursor-pointer ${src && transform && "translate-y-[-10%] transform"}`}
        onClick={() => handleImageClick && handleImageClick(image)}
      />
    </div>
  );
}
