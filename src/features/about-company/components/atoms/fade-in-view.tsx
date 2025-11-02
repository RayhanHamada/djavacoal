"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

interface FadeInViewProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export default function FadeInView({
    children,
    delay = 0,
    duration = 0.6,
    className,
}: FadeInViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
