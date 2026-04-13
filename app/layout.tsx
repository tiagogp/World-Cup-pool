import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { siteDescription, siteName, siteOgImage, siteUrl } from "@/lib/site";
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
    url: siteUrl,
    siteName,
    title: "Bolão da Copa 2026: simulador de chaves",
    description: "Bolão da Copa 2026 para escolher classificados, montar o mata-mata e compartilhar sua previsão.",
    images: [
      {
        url: siteOgImage,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Bolão da Copa 2026 - simulador de chaves"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolão da Copa 2026: simulador de chaves",
    description: "Bolão da Copa 2026 para montar sua chave e compartilhar sua previsão.",
    images: [siteOgImage]
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
        url: "/icon.svg",
        type: "image/svg+xml"
      }
    ],
    shortcut: ["/icon.svg"],
    apple: [
      {
        url: "/apple-icon.svg",
        type: "image/svg+xml",
        sizes: "180x180"
      }
    ]
  },
  other: {
    "og:image": siteOgImage,
    "og:image:secure_url": siteOgImage,
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "twitter:image": siteOgImage
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
