import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ListChecks, Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageFooter } from "@/components/PageFooter";
import { PageHeader } from "@/components/PageHeader";
import { siteDescription, siteName, siteOgImage, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bolão e simulador de chaves",
  description: siteDescription,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `${siteName}: bolão e simulador de chaves`,
    description: siteDescription,
    url: siteUrl,
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
    title: `${siteName}: bolão e simulador de chaves`,
    description: siteDescription,
    images: [siteOgImage]
  }
};

const flow = [
  {
    icon: ListChecks,
    title: "Escolha os classificados",
    text: "Clique em 1º, 2º e 3º de cada grupo e selecione os 8 melhores terceiros.",
  },
  {
    icon: Trophy,
    title: "Monte o mata-mata",
    text: "O chaveamento nasce automaticamente a partir das suas escolhas.",
  },
  {
    icon: Share2,
    title: "Compartilhe no celular",
    text: "Use o compartilhamento nativo ou copie um link com a previsão completa.",
  },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    url: siteUrl,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    description: siteDescription,
    inLanguage: "pt-BR",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL"
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader />
      <section className="pitch-grid mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full bg-[#e2f6d5] px-4 py-2 text-sm font-semibold tracking-[-0.108px] text-[#163300]">
            Copa do Mundo 2026
          </p>
          <h1 className="wise-display mt-6 max-w-5xl text-[54px] leading-[0.85] text-[#0e0f0c] sm:text-[82px] lg:text-[112px]">
            Sua Copa. Seu mapa até a taça.
          </h1>
          <p className="mt-6 max-w-2xl text-[20px] font-semibold leading-8 tracking-[-0.108px] text-[#454745]">
            Selecione os classificados, avance o mata-mata e compartilhe uma
            previsão completa com a temperatura de uma final.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/predict">
                Começar agora
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/predict">Explorar fluxo</Link>
            </Button>
          </div>
        </div>

        <div className="min-h-[440px] overflow-hidden rounded-[40px] bg-[#0e0f0c] p-5 text-white">
          <div className="mb-5 grid grid-cols-6 overflow-hidden rounded-full">
            {["#9fe870", "#cdffad", "#e2f6d5", "#9fe870", "#cdffad", "#e2f6d5"].map(
              (color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="h-3"
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
          <div className="grid h-full min-h-[400px] grid-rows-[1fr_auto]">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["12", "grupos"],
                ["32", "classificados"],
                ["6", "rodadas"],
                ["1", "campeão"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[30px] bg-white p-5 text-[#0e0f0c]"
                >
                  <p className="wise-display text-[64px] leading-[0.85]">
                    {value}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-[-0.108px] text-[#454745]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[30px] bg-[#9fe870] p-5 text-[#163300]">
              <p className="text-sm font-semibold tracking-[-0.108px]">
                Prediction builder
              </p>
              <p className="wise-display mt-2 text-[40px] leading-[0.85]">
                Tudo pronto para compartilhar.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:col-span-2 md:grid-cols-3">
          {flow.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <item.icon className="size-8 text-[#163300]" />
                  <h2 className="text-xl font-semibold leading-[1.23] tracking-[-0.39px]">
                    {item.title}
                  </h2>
                </div>
                <p className="text-lg leading-7 tracking-[0.18px] text-[#454745]">
                  {item.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <PageFooter />
    </main>
  );
}
