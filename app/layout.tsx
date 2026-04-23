import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Caveat } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { Cursor } from "@/components/Cursor";
import { Konami } from "@/components/Konami";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "for krishnaa — happy birthday",
  description: "a small internet for chungi. 04.24.2026",
  openGraph: {
    title: "for krishnaa — happy birthday",
    description: "a small internet for chungi.",
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${caveat.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
        <div className="grain" aria-hidden />
        <Cursor />
        <Konami />
      </body>
    </html>
  );
}
