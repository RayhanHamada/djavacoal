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
                width={333}
                height={427}
                className="aspect-[333/426.47] border border-[#696969] object-cover"
            />
            <p className="text-sm text-gray-400">{role}</p>
            <p className="font-medium">{name}</p>
        </div>
    );
}
