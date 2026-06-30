import ShopVerifyEmailForm from "@/app/components/ShopVerifyEmailForm";

export default async function ShopVerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }> | { email?: string };
}) {
  const params = await Promise.resolve(searchParams);
  return <ShopVerifyEmailForm initialEmail={params.email || ""} />;
}

