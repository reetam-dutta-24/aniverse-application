import Image from "next/image";

interface DetailImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/** High-quality detail hero/poster — avoids blurry scaling on large displays. */
export function DetailImage({ src, alt, className, priority }: DetailImageProps) {
  const isLocal = src.startsWith("/");

  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={95}
        sizes="(max-width: 1024px) 100vw, 40vw"
        className={className ?? "object-cover object-top"}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className ?? "size-full object-cover object-top"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
