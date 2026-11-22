import { test } from "node:test";
import assert from "node:assert/strict";
import { clientIp, createRateLimiter } from "../app/lib/rateLimit.ts";

test("allows up to the limit, then asks the sender to wait", () => {
  const rl = createRateLimiter({ limit: 3, windowMs: 60_000 });
  const t = 1_000_000;
  assert.equal(rl.hit("a", t), 0);
  assert.equal(rl.hit("a", t + 1), 0);
  assert.equal(rl.hit("a", t + 2), 0);
  assert.equal(rl.hit("a", t + 3), 60); // 4th try inside the window
  assert.equal(rl.hit("b", t + 3), 0); // other senders are unaffected
});

test("the window slides: old attempts expire", () => {
  const rl = createRateLimiter({ limit: 2, windowMs: 10_000 });
  rl.hit("a", 0);
  rl.hit("a", 5_000);
  assert.ok(rl.hit("a", 9_000) > 0);
  assert.equal(rl.hit("a", 10_001), 0); // the first attempt has expired
});

test("client IP comes from the first x-forwarded-for hop", () => {
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" })), "203.0.113.7");
  assert.equal(clientIp(new Headers({ "x-real-ip": "198.51.100.2" })), "198.51.100.2");
  assert.equal(clientIp(new Headers()), "unknown");
});
