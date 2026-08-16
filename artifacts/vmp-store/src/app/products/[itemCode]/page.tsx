export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ itemCode: string }>;
}) {
  const { itemCode } = await params;
  // ...
}
