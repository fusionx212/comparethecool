import { RememberMarket } from "@/components/RememberMarket";

export default function HeatCountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}) {
  return <HeatCountryLayoutInner params={params}>{children}</HeatCountryLayoutInner>;
}

async function HeatCountryLayoutInner({
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
