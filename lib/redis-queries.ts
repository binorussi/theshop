import { redis } from '@/lib/redis';

export async function getProductStock(productId: string): Promise<number> {
  const stock = await redis.get<number>(`product:stock:${productId}`);
  return stock ?? 0;
}