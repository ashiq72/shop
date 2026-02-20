export type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  children?: Category[];
};

export type ProductVariant = {
  sku?: string;
  price?: number;
  salePrice?: number;
  stock?: number;
  isActive?: boolean;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  images?: string[];
  thumbnail?: string;
  categories?: Category[];
  brand?: string;
  tags?: string[];
  trackStock?: boolean;
  stock?: number;
  variants?: ProductVariant[];
};

export type ReviewSummary = {
  total: number;
  average: number;
  breakdown: Array<{ rating: number; count: number }>;
};

export type Slider = {
  _id?: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
  priority?: number;
};

export type Branding = {
  logoDesktop?: string;
  logoMobile?: string;
};
