import { Metadata } from "next";

import { ProductContent } from "@/features/our-products/components/organism";
import { getProductMetadata } from "@/features/our-products/server/dal";

interface ProductPageProps {
    params: Promise<{ productId: string }>;
}

export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const productId = resolvedParams.productId;

    if (isNaN(Number(productId))) return {};

    const product = await getProductMetadata(Number(productId));
    if (!product) return {};

    const title = product.en_name;
    const description =
        product.metadata_description ||
        `Details and specifications for ${product.en_name}. Explore features, packaging options, and more.`;

    const keywords = product.metadata_keywords;
    const imagekey = product.medias.at(0)?.image_key;
    const imageURL = imagekey
        ? new URL(imagekey, process.env.NEXT_PUBLIC_ASSET_URL).toString()
        : undefined;

    return {
        title,
        description,
        keywords,
        openGraph: {
            type: "website",
            title,
            description,
            images: imageURL,
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productId } = await params;
    return <ProductContent productId={Number(productId)} />;
}
