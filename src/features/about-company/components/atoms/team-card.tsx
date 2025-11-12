import type { TeamMember } from "../../lib/types";

import Image from "next/image";

interface TeamCardProps {
    member: Pick<TeamMember, "name" | "role" | "image">;
}

export default function TeamCard({
    member: { name, role, image },
}: TeamCardProps) {
    return (
        <div className="flex w-fit flex-col justify-center space-y-2 text-center">
            <Image
                src={image}
                alt={name}
                width={300}
                height={300}
                className="aspect-3/4 border border-gray-600 bg-radial from-black via-[#222222] to-[#444444] object-cover"
            />
            <p className="text-sm text-gray-400">{role}</p>
            <p className="font-medium">{name}</p>
        </div>
    );
}
