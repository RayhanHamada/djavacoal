interface ContactInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

export function ContactInfoItem({ icon, label, value }: ContactInfoItemProps) {
  return (
    <div>
      <div className="flex flex-col-2 items-start gap-3 mb-2">
        {/* Icon */}
        <div className="text-secondary text-xl flex-shrink-0 mt-1">{icon}</div>

        {/* Label + Value */}
        <div className="flex flex-col">
          <p className="text-secondary font-semibold">{label}</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-300 leading-snug">{value}</p>
      </div>
    </div>
  );
}
