import Image from "next/image";
import { shouldServeOriginalImage } from "@/lib/image-display";
import { cn } from "@/lib/utils";

interface HdImageProps {
  src: string;
  alt: string;
  className?: string;
  /** When true, image fills a `relative` parent (absolute inset-0). */
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

/** Sharp catalog / upload images — bypasses Next optimizer for local originals. */
export function HdImage({
  src,
  alt,
  className,
  fill = false,
  priority,
  sizes,
}: HdImageProps) {
  const useOriginal = shouldServeOriginalImage(src) || !src.startsWith("/");

  if (useOriginal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(
          fill ? "absolute inset-0 size-full object-cover object-center" : undefined,
          className,
        )}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={100}
        unoptimized
        sizes={sizes ?? "100vw"}
        className={className ?? "object-cover object-center"}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
