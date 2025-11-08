import { BlogListSection } from "@/features/blog/components";

// Temporary mock data - replace with actual data fetching
const mockPosts = [
    {
        id: "1",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-1.png",
    },
    {
        id: "2",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-2.png",
    },
    {
        id: "3",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-3.png",
    },
    {
        id: "4",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-4.png",
    },
    {
        id: "5",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-1.png",
    },
    {
        id: "6",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-2.png",
    },
    {
        id: "7",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-3.png",
    },
    {
        id: "8",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-4.png",
    },
    {
        id: "9",
        title: "Dengarkan Bisnis Plan Tahun 2021 dari Resource Alam Indonesia (KKGI)",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-1.png",
    },
];

export default function BlogPage() {
    return <BlogListSection posts={mockPosts} />;
}
