"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

interface SlideInViewProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    yOffset?: number;
    className?: string;
}

export default function SlideInView({
    children,
    delay = 0,
    duration = 0.6,
    yOffset = 30,
    className,
}: SlideInViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
