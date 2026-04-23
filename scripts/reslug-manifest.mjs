#!/usr/bin/env node
// Reassign slug field in public/gallery/manifest.json based on smarter
// filename + date heuristics. Anything before the together date (2025-06-15)
// is pushed to bonus / prologue regardless of keywords.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST = path.join(ROOT, "public", "gallery", "manifest.json");
const TOGETHER = new Date("2025-06-13T00:00:00Z").getTime();

function slugFor({ date, label }) {
  const d = new Date(date);
  const t = d.getTime();
  const y = d.getUTCFullYear();
  const mo = d.getUTCMonth() + 1;
  const dd = d.getUTCDate();
  const n = (label || "").toUpperCase();

  // Anything before together → prologue (bonus)
  if (t < TOGETHER) return "bonus";

  // Strong filename cues (override date)
  if (/DAKSHIN|DAKDHINCHITRA/.test(n)) return "03-dakshinchitra";
  if (/CHIKMA/.test(n)) return "04-chikmagalur";
  if (/VALENTINE/.test(n) && y >= 2026) return "06-valentine";
  if (/CHERTHALA/.test(n)) return "05-year-end";
  if (/ACCIDENT|HOSPITAL/.test(n)) return "07-us-now";
  if (/UDAIPUR|IIM/.test(n)) return "01-day-one";

  // Date buckets
  if (y === 2025 && mo === 6 && dd >= 10 && dd <= 20) return "01-day-one";
  if (y === 2025 && ((mo === 6 && dd > 20) || mo === 7)) return "02-early-nights";
  if (y === 2025 && mo === 8) return "03-dakshinchitra";
  if (y === 2025 && (mo === 9 || mo === 10)) return "04-chikmagalur";
  if (y === 2025 && (mo === 11 || mo === 12)) return "05-year-end";
  if (y === 2026 && mo === 1) return "05-year-end";
  if (y === 2026 && mo === 2) return "06-valentine";
  if (y === 2026 && mo === 3) return "07-us-now";
  if (y === 2026 && mo === 4) return "08-today";
  return "bonus";
}

const m = JSON.parse(readFileSync(MANIFEST, "utf8"));
for (const it of m.items) {
  it.slug = slugFor({ date: it.date, label: it.label });
}
writeFileSync(MANIFEST, JSON.stringify(m, null, 2));

const bySlug = {};
for (const it of m.items) bySlug[it.slug] = (bySlug[it.slug] || 0) + 1;
console.log("re-slugged:", bySlug);
