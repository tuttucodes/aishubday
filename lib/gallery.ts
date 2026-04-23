export type GalleryKind = "image" | "video";

export type GalleryItem = {
  id: string;
  kind: GalleryKind;
  src: string;
  thumb: string;
  date: string;
  gps: { lat: number; lon: number } | null;
  place: string | null;
  slug: string;
  label: string;
};

export type GalleryManifest = {
  generated: string;
  items: GalleryItem[];
};
