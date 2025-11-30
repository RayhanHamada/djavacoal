interface SectionHeadingProps {
    children: React.ReactNode;
}

/**
 * Heading for product detail sections.
 */
export function SectionHeading({ children }: SectionHeadingProps) {
    return <h3 className="text-xl font-bold text-white">{children}</h3>;
}
