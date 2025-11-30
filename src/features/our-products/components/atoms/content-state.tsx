interface ContentStateProps {
    message: string;
}

/**
 * Loading state display for product content.
 */
export function LoadingState({ message }: ContentStateProps) {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-white">{message}</div>
        </div>
    );
}

/**
 * Empty state display for product content.
 */
export function EmptyState({ message }: ContentStateProps) {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-white">{message}</div>
        </div>
    );
}
