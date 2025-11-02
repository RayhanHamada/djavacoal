"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

interface ScaleXViewProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export default function ScaleXView({
    children,
    delay = 0,
    duration = 0.6,
    className,
}: ScaleXViewProps) {
    return (
        <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
