import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolão compartilhado",
  description:
    "Veja uma previsão compartilhada da Copa 2026 com classificados por grupo, chave do mata-mata e campeão previsto.",
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: "/predict/share"
  },
  openGraph: {
    title: "Bolão da Copa 2026: previsão compartilhada",
    description:
      "Abra uma chave compartilhada da Copa 2026 em modo leitura.",
    url: "/predict/share"
  }
};

export default function ShareLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
