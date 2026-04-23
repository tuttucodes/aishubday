import { readFileSync, existsSync } from "fs";
import path from "path";
import type { GalleryManifest, GalleryItem } from "./gallery";

export function readGallery(): GalleryItem[] {
  const p = path.join(process.cwd(), "public", "gallery", "manifest.json");
  if (!existsSync(p)) return [];
  try {
    const data = JSON.parse(readFileSync(p, "utf8")) as GalleryManifest;
    return data.items || [];
  } catch {
    return [];
  }
}

export function pickForSlugs(items: GalleryItem[]): Record<string, GalleryItem[]> {
  const map: Record<string, GalleryItem[]> = {};
  for (const it of items) {
    if (!map[it.slug]) map[it.slug] = [];
    map[it.slug].push(it);
  }
  return map;
}
