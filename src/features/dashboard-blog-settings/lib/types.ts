import type { SitemapChangefreq } from "./constants";

/**
 * Blog settings data structure
 */
export interface BlogSettings {
    sitemap_changefreq: SitemapChangefreq;
    sitemap_priority: number;
}

/**
 * Form values for blog settings
 */
export interface BlogSettingsFormValues {
    changefreq: SitemapChangefreq;
    priority: number;
}

/**
 * Props for form field components
 */
export interface ChangeFrequencySelectProps {
    value: SitemapChangefreq;
    onChange: (value: SitemapChangefreq) => void;
    disabled?: boolean;
}

export interface PriorityInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}
