export type CategoryTaxonomy = {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentId?: string;
};

export type ProductImage = {
  url: string;
  altText: string;
  isPrimary?: boolean;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  gtin?: string;
  name: string;
  brand: string;
  categorySlug: string;
  subCategorySlug: string;
  description: string;
  price: number;
  currency: 'USD' | string;
  images: ProductImage[];
  inStock: boolean;
  stockQuantity: number;
  ratingAverage: number;
  reviewCount: number;
  specifications: ProductSpecification[];
  updatedAt: string;
};