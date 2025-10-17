import React from "react";

export const ContactIcon = ({
    icon,
    color,
}: {
    icon: React.ReactNode;
    color?: string;
}) => (
    <div
        className={`flex items-center justify-center text-lg ${
            color || "text-secondary"
        }`}
    >
        {icon}
    </div>
);
