type Props = { label: string; value: string };

export default function InfoCard({ label, value }: Props) {
    return (
        <div className="p-3">
            <p className="text-gray-400">{label}</p>
            <p>{value}</p>
        </div>
    );
}
