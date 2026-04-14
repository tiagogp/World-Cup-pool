const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "https://bolao-copa-2026.vercel.app";

export const siteUrl = configuredSiteUrl.startsWith("http")
  ? configuredSiteUrl.replace(/\/$/, "")
  : `https://${configuredSiteUrl.replace(/\/$/, "")}`;

export const siteName = "Bolão da Copa 2026";

export const siteDescription =
  "Bolão da Copa 2026 para montar sua previsão: escolha os classificados dos grupos, complete o mata-mata e compartilhe sua chave.";

export const siteOgImage = `${siteUrl}/og.jpg`;
