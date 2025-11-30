import { ProductContent } from "@/features/our-products/components/organism";

interface ProductPageProps {
    params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productId } = await params;
    return <ProductContent productId={Number(productId)} />;
}
