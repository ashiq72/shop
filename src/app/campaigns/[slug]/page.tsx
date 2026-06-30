import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, TicketPercent } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import ProductCard from "@/app/components/ProductCard";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(params);
  let campaign: Campaign | null = null;
  try {
    const response = await apiGet<Campaign>(
      `/ecommerce/campaigns/active/${encodeURIComponent(slug)}`,
    );
    campaign = response.data;
  } catch {
    campaign = null;
  }

  if (!campaign) {
    return (
      <main className="store-state-page store-shell">
        <h1>Campaign unavailable</h1>
        <Link href="/campaigns">Browse current offers</Link>
      </main>
    );
  }

  const offer =
    campaign.discountType === "percentage"
      ? `${campaign.discountValue}% off`
      : `${campaign.discountValue} off`;

  return (
    <main>
      <section className="merch-hero campaign">
        <Image
          src={campaign.image || "/store-hero.jpg"}
          alt={campaign.name}
          fill
          priority
          className="object-cover"
        />
        <div className="store-shell">
          <Link href="/campaigns">
            <ArrowLeft size={16} />
            Current offers
          </Link>
          <p>{campaign.badge || "Active campaign"}</p>
          <h1>{campaign.name}</h1>
          <span>{campaign.description || offer}</span>
          {campaign.code ? (
            <div className="campaign-code-display">
              <TicketPercent size={18} />
              Use code <strong>{campaign.code}</strong> at checkout
            </div>
          ) : null}
        </div>
      </section>
      <section className="store-section store-shell">
        <div className="store-section-heading">
          <div>
            <p>{offer}</p>
            <h2>Campaign products</h2>
          </div>
          <span>{campaign.products?.length || 0} products</span>
        </div>
        {campaign.products?.length ? (
          <div className="product-grid">
            {campaign.products.map((product) => (
              <ProductCard key={product._id} product={product} badge={offer} />
            ))}
          </div>
        ) : (
          <div className="store-empty">No active products match this campaign yet.</div>
        )}
      </section>
    </main>
  );
}

