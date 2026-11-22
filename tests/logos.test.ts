// Every logo shown on the site must be a single-colour icon or have a measured lightness,
// and its file must exist, so a new tech never renders in an unmatched colour.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import * as data from "../app/data.ts";
import { LIGHTNESS, MONO_LOGOS, logoFilters } from "../app/lib/logoTone.ts";

const techs = Object.values(data)
  .filter(Array.isArray)
  .flat()
  .filter((t): t is data.Tech => typeof t === "object" && t !== null && "slug" in t && "name" in t);

test("every logo is mono or measured, and its icon file exists", () => {
  const slugs = [...new Set(techs.filter((t) => !t.noIcon).map((t) => t.slug))];
  assert.ok(slugs.length > 20, "found the tech lists");
  for (const slug of slugs) {
    assert.ok(MONO_LOGOS.has(slug) || slug in LIGHTNESS, `${slug}: add it to MONO_LOGOS or LIGHTNESS`);
    assert.ok(existsSync(`public/icons/${slug}.svg`), `${slug}: public/icons/${slug}.svg is missing`);
  }
});

test("brand-colour logos get both filters; unknown ones fail loudly", () => {
  for (const slug of Object.keys(LIGHTNESS)) {
    const { light, dark } = logoFilters(slug);
    assert.match(light, /grayscale/);
    assert.match(dark, /grayscale/);
  }
  assert.throws(() => logoFilters("not-a-logo"));
});
