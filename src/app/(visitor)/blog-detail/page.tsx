import React from "react";

import { BlogDetailSection } from "@/features/blog/components/organism";

// Mock article data
const mockArticle = {
    title: "Sustainability Practices in the Mining Industry",
    date: "19 Sep 2025",
    author: "Dr. Sarah Mitchell",
    imageUrl: "/images/blog/blog-thumbnail-1.png",
    content: `
        <p>The mining industry has undergone significant transformations in recent years, with sustainability becoming a central focus for operations worldwide. As environmental concerns continue to grow, mining companies are increasingly adopting practices that minimize ecological impact while maintaining operational efficiency.</p>

        <h2>Environmental Impact Reduction</h2>
        <p>Modern mining operations implement comprehensive environmental management systems that address air quality, water conservation, and land rehabilitation. These systems incorporate advanced monitoring technologies and real-time data analysis to ensure compliance with environmental regulations.</p>

        <h2>Water Management Strategies</h2>
        <p>Water scarcity is a critical challenge in many mining regions. Progressive companies have developed innovative water recycling systems that reduce consumption by up to 80%. These closed-loop systems treat and reuse water throughout the mining process, significantly reducing the demand for fresh water resources.</p>

        <h2>Energy Efficiency Initiatives</h2>
        <p>The transition to renewable energy sources is reshaping the industry's carbon footprint. Solar and wind power installations at mine sites are becoming more common, with some operations achieving carbon neutrality through a combination of renewable energy adoption and carbon offset programs.</p>

        <h2>Community Engagement</h2>
        <p>Sustainable mining extends beyond environmental considerations to include social responsibility. Mining companies are increasingly engaging with local communities, creating employment opportunities, and investing in infrastructure and education programs that provide long-term benefits.</p>

        <h2>Looking Forward</h2>
        <p>The future of mining lies in the continued integration of sustainable practices with technological innovation. As the industry evolves, the commitment to environmental stewardship and social responsibility will remain fundamental to long-term success and community acceptance.</p>
    `,
};

// Mock related articles
const mockRelatedArticles = [
    {
        id: "2",
        title: "Innovation in Coal Processing Technology",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-2.png",
    },
    {
        id: "3",
        title: "Safety Standards in Modern Mining Operations",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-3.png",
    },
    {
        id: "4",
        title: "The Future of Energy: Coal's Evolving Role",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-4.png",
    },
];

export default function BlogDetailPage() {
    return (
        <BlogDetailSection
            article={mockArticle}
            relatedArticles={mockRelatedArticles}
        />
    );
}
