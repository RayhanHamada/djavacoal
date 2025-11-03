import type { TeamMember } from "../../lib/types";

import Image from "next/image";

interface TeamCardProps {
    member: Pick<TeamMember, "name" | "role" | "image">;
}

export default function TeamCard({
    member: { name, role, image },
}: TeamCardProps) {
    return (
        <div className="space-y-2 text-center">
            <Image
                src={image}
                alt={name}
                width={300}
                height={300}
                className="h-auto w-full rounded-md object-cover"
            />
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-400">{role}</p>
        </div>
    );
}
