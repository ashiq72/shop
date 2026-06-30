# Commerce360 Storefront

Tenant-aware Next.js ecommerce storefront backed by Base360.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_TENANT_ID` to the Base360 tenant ID.
3. Run Base360 on port `4000`.
4. Start the storefront:

```bash
npm install
npm run dev
```

Storefront: `http://localhost:3000`

The matching tenant admin is in `../dashboard` and runs at
`http://localhost:5173`.

## Admin-managed content

- Products, prices, inventory, variants, media, files, FAQs, and SEO
- Nested categories
- Storefront sliders
- Store name, tagline, announcement, contact details, currency, and logos

Cloudinary credentials belong in `../base360/.env`, never in this frontend.
