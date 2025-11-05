export async function GET(_request: Request) {
    // TODO: generate sitemap for static pages
    const _baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // TODO: change to fetch data from database
    const staticPages = ["", "/about", "/contact", "/products", "/news"];

    for (const page of staticPages) {
        const loc = new URL(page, _baseURL).toString();
        sitemap += `
            <url>
                <loc>${loc}</loc>
            </url>`;
    }

    sitemap += `</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
