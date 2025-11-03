interface InfoCardProps {
    label: string;
    value: string;
}

export default function InfoCard({ label, value }: InfoCardProps) {
    return (
        <div className="p-3">
            <p className="text-gray-400">{label}</p>
            <p>{value}</p>
        </div>
    );
}
