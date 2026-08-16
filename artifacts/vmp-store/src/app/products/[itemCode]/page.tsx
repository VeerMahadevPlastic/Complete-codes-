import { ProductDetail } from '../../components/product/ProductDetail';

export default function ProductDetailPage({ params }: { params: { itemCode: string } }) {
  return <ProductDetail itemCode={decodeURIComponent(params.itemCode)} />;
}
