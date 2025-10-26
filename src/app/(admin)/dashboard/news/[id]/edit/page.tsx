import { NewsEditPage } from "@/features/dashboard-news";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function DashboardNewsEditPage({ params }: PageProps) {
    const { id } = await params;
    const newsId = parseInt(id, 10);

    if (isNaN(newsId)) {
        return <div>Invalid news ID</div>;
    }

    return <NewsEditPage newsId={newsId} />;
}
