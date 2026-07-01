import dotenv from "dotenv";

dotenv.config();
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  automaticDeserialization: false,
});

const MAX_CACHE_TTL_SECONDS = 5 * 60;

redis.setEx = (key, seconds, value) => redis.set(key, value, { ex: Math.min(seconds, MAX_CACHE_TTL_SECONDS) });

export async function invalidateCache(patterns = []) {
  const uniquePatterns = [...new Set(patterns.filter(Boolean))];
  if (!uniquePatterns.length) return;

  const keys = new Set();

  for (const pattern of uniquePatterns) {
    const matchedKeys = await redis.keys(pattern);
    if (Array.isArray(matchedKeys)) {
      matchedKeys.forEach((key) => keys.add(key));
    }
  }

  if (keys.size) {
    await redis.del([...keys]);
  }
}

export default redis;
