# Bolão da Copa 2026

App Next.js para montar previsões: classificados por grupo (12 grupos) + mata-mata + link para compartilhar.

## Rodar local

- `npm install`
- `npm run dev`

## Configuração

- `NEXT_PUBLIC_SITE_URL` (opcional): URL pública do site (ex.: `https://bolao-copa-2026.vercel.app`)

## Dados (times/grupos)

O app usa `data/world-cup.ts` (arrays `teams` e `groups`).

Para converter um dump JSON para o formato do projeto:

- `cat dump.json | node scripts/convert-world-cup-dump.mjs > data/world-cup.ts`
