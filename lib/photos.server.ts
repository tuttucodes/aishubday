import { readdirSync, existsSync } from "fs";
import path from "path";

export function readPhotos(): string[] {
  const dir = path.join(process.cwd(), "public", "photos");
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .sort()
      .map((f) => `/photos/${f}`);
  } catch {
    return [];
  }
}
