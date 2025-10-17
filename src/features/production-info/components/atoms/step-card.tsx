import Image from "next/image";

interface StepCardProps {
    image: string;
    title: string;
    description: string;
}

export const StepCard = ({ image, title, description }: StepCardProps) => (
    <article className="overflow-hidden rounded-lg border border-neutral-800 bg-[#222222]">
        <Image
            src={image}
            alt={title}
            width={600}
            height={380}
            className="h-48 w-full object-cover md:h-56"
        />
        <div className="p-4">
            <h3 className="text-base font-semibold text-white md:text-lg">
                {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80 md:text-base">
                {description}
            </p>
        </div>
    </article>
);
