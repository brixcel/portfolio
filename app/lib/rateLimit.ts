// Small in-memory rate limiter for the contact form.
// Best effort: each Vercel function instance keeps its own memory, so a determined sender who
// hits several instances gets a few more tries. It still stops the easy abuse (one script looping
// on the form) without an external store. For a hard limit, back this with Upstash/Vercel KV.

export type RateLimiter = {
  /** Records an attempt for `key`; returns how many seconds to wait, or 0 if it's allowed. */
  hit(key: string, now?: number): number;
};

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return Math.ceil((windowMs - (now - recent[0])) / 1000);
      }
      recent.push(now);
      hits.set(key, recent);
      // Keep memory bounded if many different senders show up.
      if (hits.size > 5000) {
        for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      return 0;
    },
  };
}

/** The visitor's IP as Vercel reports it (first hop of x-forwarded-for). */
export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
