import { readdirSync, existsSync, statSync } from "fs";
import path from "path";

export type MediaKind = "image" | "video";
export type MediaItem = { src: string; kind: MediaKind };

const IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i;
const VID_RE = /\.(mp4|mov|webm|m4v)$/i;

export const MEDIA_SLUGS = [
  "01-day-one",
  "02-early-nights",
  "03-dakshinchitra",
  "04-chikmagalur",
  "05-year-end",
  "06-valentine",
  "07-us-now",
  "08-today",
] as const;

export type MediaSlug = (typeof MEDIA_SLUGS)[number];

function kindOf(name: string): MediaKind | null {
  if (IMG_RE.test(name)) return "image";
  if (VID_RE.test(name)) return "video";
  return null;
}

function listFolder(folder: string): MediaItem[] {
  const abs = path.join(process.cwd(), "public", "media", folder);
  if (!existsSync(abs)) return [];
  try {
    return readdirSync(abs)
      .filter((f) => !f.startsWith("."))
      .filter((f) => {
        try {
          return statSync(path.join(abs, f)).isFile();
        } catch {
          return false;
        }
      })
      .filter((f) => kindOf(f) !== null)
      .sort()
      .map((f) => ({ src: `/media/${folder}/${f}`, kind: kindOf(f)! }));
  } catch {
    return [];
  }
}

export function readMedia(): Record<MediaSlug, MediaItem[]> {
  const out = {} as Record<MediaSlug, MediaItem[]>;
  for (const slug of MEDIA_SLUGS) out[slug] = listFolder(slug);
  return out;
}

export function readBonus(): MediaItem[] {
  return listFolder("bonus");
}
