import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent } from "lucide-react";
import { apiGetSafe } from "@/lib/api";
import type { Campaign } from "@/lib/types";

const offerLabel = (campaign: Campaign) =>
  campaign.discountType === "percentage"
    ? `${campaign.discountValue}% off`
    : `${campaign.discountValue} off`;

export default async function CampaignsPage() {
  const response = await apiGetSafe<Campaign[]>("/ecommerce/campaigns/active");
  const campaigns = response.data || [];

  return (
    <main className="store-shell store-list-page">
      <div className="store-list-title">
        <div>
          <p>Limited-time value</p>
          <h1>Current offers</h1>
          <span>Active campaigns configured by this store.</span>
        </div>
      </div>
      {campaigns.length ? (
        <div className="merch-card-grid">
          {campaigns.map((campaign) => (
            <Link
              href={`/campaigns/${campaign.slug}`}
              key={campaign._id}
              className="merch-card campaign-card"
            >
              <div className="merch-card-media">
                <Image
                  src={campaign.image || "/store-hero.jpg"}
                  alt={campaign.name}
                  fill
                  sizes="(max-width: 720px) 100vw, 33vw"
                  className="object-cover"
                />
                <b>{campaign.badge || offerLabel(campaign)}</b>
              </div>
              <div>
                <span>{offerLabel(campaign)}</span>
                <h2>{campaign.name}</h2>
                <p>{campaign.description || "Explore products in this promotion."}</p>
                <strong>
                  Shop campaign
                  <ArrowRight size={16} />
                </strong>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <section className="store-state-page compact">
          <BadgePercent size={42} />
          <h2>No active campaigns</h2>
          <p>New offers will appear here when they go live.</p>
          <Link href="/products">Browse products</Link>
        </section>
      )}
    </main>
  );
}

