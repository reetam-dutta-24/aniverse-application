import { HdImage } from "@/components/ui/hd-image";

interface DetailImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/** High-quality detail hero/poster — serves uploads at full resolution. */
export function DetailImage({ src, alt, className, priority }: DetailImageProps) {
  return (
    <HdImage
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 1024px) 100vw, 40vw"
      className={className ?? "object-cover object-top"}
    />
  );
}
