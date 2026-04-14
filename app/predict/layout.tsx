import type { Metadata } from "next";
import { siteOgImage, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Criar bolão",
  description:
    "Escolha os classificados dos grupos, complete a chave clássica do mata-mata e gere um link para compartilhar sua previsão da Copa 2026.",
  alternates: {
    canonical: "/predict"
  },
  openGraph: {
    title: "Bolão da Copa 2026: criar previsão",
    description:
      "Monte sua chave da Copa 2026 em poucos passos e compartilhe pelo celular.",
    url: `${siteUrl}/predict`,
    images: [
      {
        url: siteOgImage,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Bolão da Copa 2026 - criar previsão"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolão da Copa 2026: criar previsão",
    description:
      "Escolha classificados, avance o mata-mata e compartilhe sua chave da Copa 2026.",
    images: [siteOgImage]
  }
};

export default function PredictLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
