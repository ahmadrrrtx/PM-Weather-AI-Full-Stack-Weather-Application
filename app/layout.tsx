import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { SkipLink } from "@/components/ui/skip-link";
import "./globals.css";

/* ─────────────────────────────
   Root layout.
   ───────────────────────────── */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://novaweather.vercel.app"),
  title: {
    default: "NovaWeather — 3D Weather Experience",
    template: "%s · NovaWeather",
  },
  description:
    "Real-time 3D weather experience with WebGL Earth, radar, satellite, air quality, astronomy, and climate analytics. Built on free open data.",
  keywords: [
    "weather",
    "3D earth",
    "WebGL",
    "radar",
    "air quality",
    "astronomy",
    "open data",
  ],
  authors: [{ name: "Muhammad Ahmad", url: "https://rrrtx-systems.com/" }],
  creator: "RRRTX Systems",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://novaweather.vercel.app",
    siteName: "NovaWeather",
    title: "NovaWeather — 3D Weather Experience",
    description:
      "Real-time 3D weather experience built on free open data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaWeather — 3D Weather Experience",
    description:
      "Real-time 3D weather experience built on free open data.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {/* Preload globe textures */}
        <link rel="preload" as="image" href="/textures/earth_atmos_2048.jpg" />
        <link rel="preload" as="image" href="/textures/earth_lights_2048.png" />
        <link rel="preload" as="image" href="/textures/earth_clouds_1024.png" />

        <Providers>
          <SkipLink />
          {children}
        </Providers>
      </body>
    </html>
  );
}
