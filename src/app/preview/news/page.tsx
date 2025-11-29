import { NewsPreviewPage } from "@/features/dashboard-news/components/pages";

/**
 * News Preview Route
 *
 * This page is placed outside the (admin) path group to use
 * Tailwind CSS styling that matches the visitor experience.
 * It reads preview data from local storage.
 */
export default function PreviewPage() {
    return <NewsPreviewPage />;
}
