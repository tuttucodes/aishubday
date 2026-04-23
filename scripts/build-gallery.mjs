#!/usr/bin/env node
// Build web-optimized gallery from raw photos/ dump.
// - HEIC/JPG/PNG → JPG 1600px + thumb 400px
// - MOV/MP4 → H.264 MP4 720p + poster frame
// - EXIF date + GPS extracted, chronologically sorted
// - Slug assigned from date + filename heuristics
// - Writes public/gallery/manifest.json

import { execFile, execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, writeFileSync, statSync, rmSync, existsSync } from "node:fs";
import { promisify } from "node:util";
import path from "node:path";

const execFileP = promisify(execFile);

const ROOT = process.cwd();
const SRC = path.join(ROOT, "photos");
const OUT = path.join(ROOT, "public", "gallery");
const TMP = path.join(ROOT, ".gallery-tmp");

const IMG_EXT = /\.(jpe?g|png|heic)$/i;
const VID_EXT = /\.(mov|mp4|m4v|webm)$/i;

function run(cmd, args) {
  try {
    return execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();
  } catch {
    return "";
  }
}

async function runP(cmd, args) {
  try {
    const { stdout } = await execFileP(cmd, args, { maxBuffer: 64 * 1024 * 1024 });
    return stdout.toString();
  } catch {
    return "";
  }
}

function parseExifDate(s) {
  // 2024:01:22 16:57:19
  const m = s.match(/(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, mi, se] = m;
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${se}Z`);
}

function dmsToDeg(str, ref) {
  // "12/1,50/1,3462/100"
  if (!str) return null;
  const parts = str.split(",").map((p) => {
    const [a, b] = p.split("/").map(Number);
    return b ? a / b : a;
  });
  if (parts.length < 3 || parts.some((n) => !Number.isFinite(n))) return null;
  let dec = parts[0] + parts[1] / 60 + parts[2] / 3600;
  if (ref === "S" || ref === "W") dec = -dec;
  return Math.round(dec * 1e6) / 1e6;
}

function readImageMeta(file) {
  // sips is built-in + fast (no full decode). GPS sacrificed for speed.
  const sipsOut = run("sips", ["-g", "creation", file]);
  const m = sipsOut.match(/creation:\s*([^\n]+)/);
  let d = m ? parseExifDate(m[1]) : null;
  if (!d) d = statSync(file).mtime;
  return { date: d, gps: null };
}

function readVideoMeta(file) {
  const raw = run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format_tags=creation_time,location,com.apple.quicktime.creationdate,com.apple.quicktime.location.ISO6709",
    "-of",
    "default=nw=1",
    file,
  ]);
  let dateStr = "";
  let gps = null;
  const lines = raw.split("\n");
  for (const l of lines) {
    if (l.startsWith("TAG:creation_time=") && !dateStr)
      dateStr = l.split("=")[1] || "";
    if (l.startsWith("TAG:com.apple.quicktime.creationdate=")) dateStr = l.split("=")[1] || dateStr;
    if (l.startsWith("TAG:com.apple.quicktime.location.ISO6709=") || l.startsWith("TAG:location=")) {
      const v = l.split("=")[1] || "";
      const m = v.match(/([+-]\d+\.\d+)([+-]\d+\.\d+)/);
      if (m) gps = { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
    }
  }
  let d = parseExifDate(dateStr) || statSync(file).mtime;
  return { date: d, gps };
}

const LOCATIONS = [
  // rough bounding boxes or centers
  { name: "Chennai", lat: 13.0, lon: 80.2, r: 0.4 },
  { name: "Dakshinchitra", lat: 12.79, lon: 80.24, r: 0.05 },
  { name: "Pondicherry", lat: 11.93, lon: 79.83, r: 0.2 },
  { name: "Chikmagalur", lat: 13.32, lon: 75.77, r: 0.35 },
  { name: "Bangalore", lat: 12.97, lon: 77.59, r: 0.3 },
  { name: "Udaipur", lat: 24.57, lon: 73.71, r: 0.3 },
  { name: "Kerala", lat: 10.0, lon: 76.3, r: 1.5 },
  { name: "Cherthala", lat: 9.68, lon: 76.34, r: 0.1 },
];

function nameGps(gps) {
  if (!gps) return null;
  for (const loc of LOCATIONS) {
    const dx = gps.lat - loc.lat;
    const dy = gps.lon - loc.lon;
    if (Math.sqrt(dx * dx + dy * dy) < loc.r) return loc.name;
  }
  return null;
}

function slugFor({ date, filename, place }) {
  const n = filename.toUpperCase();
  if (n.includes("CHIKMA") || n.includes("CHIKMANAGLUR") || place === "Chikmagalur") return "04-chikmagalur";
  if (n.includes("DAKSHIN") || n.includes("DC ") || place === "Dakshinchitra") return "03-dakshinchitra";
  if (n.includes("UDAIPUR")) return "bonus";
  if (n.includes("VALENTINE") || n.includes("V DAY")) return "06-valentine";
  if (n.includes("BEACH TERRACE") || n.includes("BEACH TERACE") || n.includes("BREAHCTERACE")) return "02-early-nights";
  if (n.includes("ONAM")) return "02-early-nights";
  if (n.includes("CHERTHALA")) return "05-year-end";
  if (n.includes("ACCIDENT")) return "07-us-now";
  if (!date) return "bonus";
  const y = date.getUTCFullYear();
  const mo = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  if (y === 2025 && mo === 6 && d >= 12 && d <= 18) return "01-day-one";
  if (y === 2025 && mo >= 6 && mo <= 7) return "02-early-nights";
  if (y === 2025 && mo === 8) return "03-dakshinchitra";
  if (y === 2025 && mo >= 9 && mo <= 10) return "04-chikmagalur";
  if (y === 2025 && mo >= 11) return "05-year-end";
  if (y === 2026 && mo === 1) return "05-year-end";
  if (y === 2026 && mo === 2) return "06-valentine";
  if (y === 2026 && mo === 3) return "07-us-now";
  if (y === 2026 && mo === 4) return "08-today";
  return "bonus";
}

function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

function clearDir(p) {
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  mkdirSync(p, { recursive: true });
}

async function processImage(src, idSlug) {
  const full = path.join(OUT, `${idSlug}.jpg`);
  const thumb = path.join(OUT, `${idSlug}-thumb.jpg`);
  // magick handles HEIC directly, resize + strip
  await Promise.all([
    runP("magick", [
      src,
      "-auto-orient",
      "-strip",
      "-resize",
      "1600x1600>",
      "-quality",
      "78",
      "-colorspace",
      "sRGB",
      full,
    ]),
    runP("magick", [
      src,
      "-auto-orient",
      "-strip",
      "-resize",
      "500x500>",
      "-quality",
      "70",
      "-colorspace",
      "sRGB",
      thumb,
    ]),
  ]);
  return {
    src: `/gallery/${idSlug}.jpg`,
    thumb: `/gallery/${idSlug}-thumb.jpg`,
  };
}

async function processVideo(src, idSlug) {
  const full = path.join(OUT, `${idSlug}.mp4`);
  const poster = path.join(OUT, `${idSlug}-poster.jpg`);
  await runP("ffmpeg", [
    "-y",
    "-i",
    src,
    "-t",
    "30",
    "-vf",
    "scale='min(960,iw)':-2,format=yuv420p",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "30",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "80k",
    "-ac",
    "2",
    "-max_muxing_queue_size",
    "1024",
    full,
  ]);
  await runP("ffmpeg", [
    "-y",
    "-ss",
    "0.8",
    "-i",
    src,
    "-vframes",
    "1",
    "-vf",
    "scale='min(800,iw)':-2",
    "-q:v",
    "5",
    poster,
  ]);
  return {
    src: `/gallery/${idSlug}.mp4`,
    thumb: `/gallery/${idSlug}-poster.jpg`,
  };
}

async function main() {
  if (!existsSync(SRC)) {
    console.error("no photos/ folder");
    process.exit(1);
  }
  clearDir(OUT);
  ensureDir(TMP);

  const files = readdirSync(SRC)
    .filter((f) => !f.startsWith("."))
    .filter((f) => IMG_EXT.test(f) || VID_EXT.test(f));
  console.log(`[gallery] ${files.length} files`);

  const items = [];
  for (const f of files) {
    const abs = path.join(SRC, f);
    const isVid = VID_EXT.test(f);
    const meta = isVid ? readVideoMeta(abs) : readImageMeta(abs);
    const place = nameGps(meta.gps);
    items.push({
      filename: f,
      abs,
      kind: isVid ? "video" : "image",
      date: meta.date,
      gps: meta.gps,
      place,
      slug: slugFor({ date: meta.date, filename: f, place }),
    });
  }

  items.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Pre-assign IDs + kinds for manifest ordering
  const jobs = items.map((it, i) => {
    const id = String(i + 1).padStart(3, "0");
    return {
      ...it,
      id,
      idSlug: `${id}-${it.kind}`,
      label: it.filename
        .replace(/\.[^.]+$/, "")
        .replace(/[_-]/g, " ")
        .toLowerCase()
        .trim()
        .slice(0, 80),
    };
  });

  // Parallel pool: 6 workers (async, so I/O parallelizes)
  const POOL = 6;
  const manifest = new Array(jobs.length);
  let nextIdx = 0;
  let completed = 0;

  async function worker(wid) {
    while (true) {
      const i = nextIdx++;
      if (i >= jobs.length) return;
      const job = jobs[i];
      const out = await (job.kind === "image"
        ? processImage(job.abs, job.idSlug)
        : processVideo(job.abs, job.idSlug));
      completed++;
      console.log(`[${completed}/${jobs.length}] w${wid} ${job.kind} ${job.filename.slice(0, 44)}`);
      if (!existsSync(path.join(ROOT, "public" + out.src))) {
        console.warn(`  skip — conversion failed for ${job.filename}`);
        continue;
      }
      manifest[i] = {
        id: job.id,
        kind: job.kind,
        src: out.src,
        thumb: out.thumb,
        date: job.date.toISOString(),
        gps: job.gps,
        place: job.place,
        slug: job.slug,
        label: job.label,
      };
    }
  }

  await Promise.all(Array.from({ length: POOL }, (_, w) => worker(w)));
  const manifestFinal = manifest.filter(Boolean);

  writeFileSync(
    path.join(OUT, "manifest.json"),
    JSON.stringify({ generated: new Date().toISOString(), items: manifestFinal }, null, 2),
  );
  console.log(`[gallery] wrote ${manifestFinal.length} items`);

  // summary by slug
  const bySlug = {};
  for (const m of manifestFinal) bySlug[m.slug] = (bySlug[m.slug] || 0) + 1;
  console.log("[gallery] by slug:", bySlug);
}

await main();
