export default async function Page({
  params,
}: {
  params: Promise<{ itemCode: string }>;
}) {
  const { itemCode } = await params;
  // ...
}
