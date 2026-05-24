import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM Weather AI — Muhammad Ahmad",
  description:
    "Full-stack AI weather application built by Muhammad Ahmad for PM Accelerator AI Engineer Internship technical assessment. Features real-time weather, 5-day forecast, maps, CRUD records, and data export.",
  keywords:
    "weather app, PM Accelerator, Muhammad Ahmad, AI engineer, full-stack, Next.js",
  authors: [{ name: "Muhammad Ahmad" }],
  openGraph: {
    title: "PM Weather AI — Muhammad Ahmad",
    description:
      "Full-stack weather application for PM Accelerator AI Engineer Internship",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080f28" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
