import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bolão da Copa 2026",
    short_name: "Bolão 2026",
    description: "Monte e compartilhe sua chave da Copa do Mundo 2026.",
    start_url: "/predict",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9fe870",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml"
      }
    ]
  };
}
