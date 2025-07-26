import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface ImageHeaderCardProps {
  imageSrc: StaticImageData | string;
  imageAlt: string;
  title: string;
  description: ReactNode;
  imageClassName?: string;
  containerClassName?: string;
}

export function ImageHeaderCard({
  imageSrc,
  imageAlt,
  title,
  description,
  imageClassName = "",
  containerClassName = "",
}: ImageHeaderCardProps) {
  return (
    <div className={`max-w-3xl mx-auto ${containerClassName}`}>
      {/* Image at top */}
      <div className="mb-6 rounded-lg overflow-hidden flex justify-center">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={120}
          height={120}
          className={`object-cover ${imageClassName}`}
        />
      </div>

      {/* Centered title */}
      <h2 className="text-4xl font-bold text-center">{title}</h2>

      {/* Left-aligned description */}
      <div className="text-left text-gray-400 space-y-4 text-2xl p-12 ">
        {description}
      </div>
    </div>
  );
}