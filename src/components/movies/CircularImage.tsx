import Image from "next/image";

import { cn } from "@/lib/utils";
import noImage from "@/assets/avatar-placeholder.png";

interface CircularImageProps {
  src: string;
  size?: number;
  alt: string;
  className?: string;
}

export default function CircularImage({
  src,
  size,
  alt,
  className,
}: CircularImageProps) {
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
        className={`object-cover ${src && "translate-y-[-10%] transform"}`}
      />
    </div>
  );
}
