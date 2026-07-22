import { RememberMarket } from "@/components/RememberMarket";

export default function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}) {
  // Next 15+ passes params as a Promise in layouts too
  return <CountryLayoutInner params={params}>{children}</CountryLayoutInner>;
}

async function CountryLayoutInner({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return (
    <>
      <RememberMarket code={country} />
      {children}
    </>
  );
}
