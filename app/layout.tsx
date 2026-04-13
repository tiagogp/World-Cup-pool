import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bolão da Copa 2026: simulador de chaves",
    template: "Bolão da Copa 2026: %s"
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "bolão copa 2026",
    "simulador copa do mundo",
    "chave copa 2026",
    "previsão copa do mundo",
    "mata-mata copa 2026",
    "world cup predictor"
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "sports",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName,
    title: "Bolão da Copa 2026: simulador de chaves",
    description: "Bolão da Copa 2026 para escolher classificados, montar o mata-mata e compartilhar sua previsão.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Bolão da Copa 2026 - simulador de chaves"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolão da Copa 2026: simulador de chaves",
    description: "Bolão da Copa 2026 para montar sua chave e compartilhar sua previsão.",
    images: ["/opengraph-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='32' fill='%239fe870'/%3E%3Ctext x='32' y='39' text-anchor='middle' font-size='30' font-family='Arial' font-weight='700' fill='%23163300'%3E⚽%3C/text%3E%3C/svg%3E"
      }
    ],
    apple: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' rx='44' fill='%239fe870'/%3E%3Ctext x='90' y='112' text-anchor='middle' font-size='88' font-family='Arial' font-weight='700' fill='%23163300'%3E⚽%3C/text%3E%3C/svg%3E"
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#9fe870"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${archivoBlack.variable}`}>
      <body>{children}</body>
    </html>
  );
}
