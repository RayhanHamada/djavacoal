// src/features/productionInfo/components/atoms/StepCard.tsx
import Image from "next/image";

interface StepCardProps {
  image: string;
  title: string;
  description: string;
}

export const StepCard = ({ image, title, description }: StepCardProps) => (
  <article className="bg-[#222222] rounded-lg overflow-hidden border border-neutral-800">
    <Image
      src={image}
      alt={title}
      width={600}
      height={380}
      className="w-full h-48 md:h-56 object-cover"
    />
    <div className="p-4">
      <h3 className="text-white font-semibold text-base md:text-lg">{title}</h3>
      <p className="text-white/80 text-sm md:text-base mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  </article>
);
