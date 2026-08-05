import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { SkipLink } from "@/components/ui/skip-link";
import "./globals.css";

/* ─────────────────────────────
   Root layout — fonts, metadata,
   providers, texture preloads.
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
    default: "NovaWeather — Next Generation 3D Weather Experience",
    template: "%s · NovaWeather",
  },
  description:
    "A cinematic 3D weather experience: real-time WebGL Earth with day/night cycles, live radar & satellite maps, air quality, astronomy and climate analytics. Powered entirely by free open data.",
  keywords: [
    "weather",
    "3D earth",
    "WebGL",
    "radar",
    "satellite",
    "air quality",
    "astronomy",
    "open data",
    "open-meteo",
    "Next.js",
  ],
  authors: [{ name: "Muhammad Ahmad", url: "https://rrrtx-systems.com/" }],
  creator: "RRRTX Systems",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://novaweather.vercel.app",
    siteName: "NovaWeather",
    title: "NovaWeather — Next Generation 3D Weather Experience",
    description:
      "Real-time WebGL Earth · radar & satellite · air quality · astronomy · climate analytics. 100% free open data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaWeather — Next Generation 3D Weather Experience",
    description:
      "Real-time WebGL Earth · radar & satellite · air quality · astronomy · climate analytics. 100% free open data.",
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
  themeColor: "#03060d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {/* Preload globe textures — served from /textures with immutable cache */}
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
