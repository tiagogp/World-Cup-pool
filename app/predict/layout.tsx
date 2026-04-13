import type { Metadata } from "next";

export const metadata: Metadata = {
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
    url: "/predict"
  },
  twitter: {
    title: "Bolão da Copa 2026: criar previsão",
    description:
      "Escolha classificados, avance o mata-mata e compartilhe sua chave da Copa 2026."
  }
};

export default function PredictLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
