import Image from "next/image";

type Props = { name: string; role: string; image: string };

export default function TeamCard({ name, role, image }: Props) {
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
