import { redis } from '@/lib/redis';

async function resetAndSeed() {
  console.log('Clearing old keys from Redis...');
  await redis.flushdb();

  console.log('Seeding stock = 100 for prod-001 to prod-085...');
  for (let i = 1; i <= 85; i++) {
    const id = `prod-${String(i).padStart(3, '0')}`;
    await redis.set(`product:stock:${id}`, 100);
    console.log(`[+] product:stock:${id} = 100`);
  }

  console.log('\nDone! Database is now clean with only stock keys.');
}

resetAndSeed();