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
        src:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='48' fill='%239fe870'/%3E%3Ctext x='96' y='119' text-anchor='middle' font-size='96' font-family='Arial' font-weight='700' fill='%23163300'%3E⚽%3C/text%3E%3C/svg%3E",
        sizes: "192x192",
        type: "image/svg+xml"
      },
      {
        src:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='128' fill='%239fe870'/%3E%3Ctext x='256' y='318' text-anchor='middle' font-size='256' font-family='Arial' font-weight='700' fill='%23163300'%3E⚽%3C/text%3E%3C/svg%3E",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ]
  };
}
