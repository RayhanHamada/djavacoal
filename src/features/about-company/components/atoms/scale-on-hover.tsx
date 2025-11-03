"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

interface ScaleOnHoverProps {
    children: ReactNode;
    scale?: number;
    duration?: number;
    className?: string;
}

export default function ScaleOnHover({
    children,
    scale = 1.05,
    duration = 0.25,
    className,
}: ScaleOnHoverProps) {
    return (
        <motion.div
            whileHover={{ scale }}
            transition={{ duration }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
