#!/usr/bin/env node
/**
 * Convert Globo's World Cup JSON to this project's `Team[]` + `Group[]` shape.
 *
 * Usage:
 *   node scripts/convert-globo.mjs path/to/globo.json
 *   cat globo.json | node scripts/convert-globo.mjs
 */

import fs from "node:fs";

function readInput(pathArg) {
  if (pathArg) {
    return fs.readFileSync(pathArg, "utf8");
  }

  // 0 is stdin fd; works when piped.
  return fs.readFileSync(0, "utf8");
}

function normalize(str) {
  return String(str ?? "")
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function flagCodeFromEmoji(emoji) {
  const text = String(emoji ?? "").trim();
  const codepoints = Array.from(text);
  if (codepoints.length !== 2) return null;

  const a = codepoints[0].codePointAt(0);
  const b = codepoints[1].codePointAt(0);
  if (a == null || b == null) return null;

  // Regional Indicator Symbol Letter A starts at 0x1F1E6.
  const A = 0x1f1e6;
  if (a < A || b < A) return null;
  const c1 = String.fromCharCode(65 + (a - A));
  const c2 = String.fromCharCode(65 + (b - A));
  if (!/^[A-Z]{2}$/.test(c1 + c2)) return null;

  return c1 + c2;
}

// Our canonical ids are mostly 3-letter, but differ from Globo in a few cases.
const idOverridesBySlug = {
  alemanha: "ger",
  "estados-unidos": "usa",
  holanda: "ned",
  inglaterra: "eng",
  "coreia-do-sul": "kor",
  japao: "jpn",
  "arabia-saudita": "ksa",
  "cabo-verde": "cpv",
  "costa-do-marfim": "civ",
  "africa-do-sul": "rsa",
  "rd-congo": "rdc"
};

const flagCodeOverridesBySlug = {
  inglaterra: "GB",
  escocia: "GB",
  "pais-de-gales": "GB"
};

function teamIdFromGloboTeam(team) {
  const slug = String(team?.slug ?? "").trim();
  if (!slug) return null;
  return idOverridesBySlug[slug] ?? normalize(team.sigla).slice(0, 3);
}

function groupCodeFromGloboGroup(group) {
  const name = String(group?.nome_grupo ?? "");
  const match = name.match(/Grupo\s+([A-Z])/i);
  if (match?.[1]) return match[1].toUpperCase();

  const ordem = Number(group?.ordem);
  if (Number.isFinite(ordem) && ordem >= 1 && ordem <= 26) {
    return String.fromCharCode(64 + ordem);
  }

  return null;
}

function main() {
  const raw = readInput(process.argv[2]);
  const parsed = JSON.parse(raw);

  const globoTeams = Array.isArray(parsed?.equipes) ? parsed.equipes : [];
  const globoGroups = Array.isArray(parsed?.grupos) ? parsed.grupos : [];

  const equipeIdToTeam = new Map(
    globoTeams.map((team) => [team?.equipe_id, team]).filter(([id]) => typeof id === "number")
  );

  const usedEquipeIds = new Set();
  for (const group of globoGroups) {
    for (const entry of group?.classificacao ?? []) {
      if (typeof entry?.equipe_id === "number") usedEquipeIds.add(entry.equipe_id);
    }
  }

  const usedTeams = [...usedEquipeIds]
    .map((id) => equipeIdToTeam.get(id))
    .filter(Boolean);

  const teams = usedTeams
    .map((team) => {
      const id = teamIdFromGloboTeam(team);
      if (!id) {
        throw new Error(`Missing team id for slug=${JSON.stringify(team?.slug)}`);
      }

      const slug = String(team.slug ?? "").trim();
      const flagCode =
        flagCodeOverridesBySlug[slug] ??
        flagCodeFromEmoji(team?.bandeiraEmoji) ??
        null;

      return {
        id,
        name: String(team?.nome_popular ?? team?.apelido ?? team?.nome ?? id),
        shortName: id.toUpperCase(),
        flagCode
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id, "pt-BR"));

  const globoTeamIdByEquipeId = new Map(
    usedTeams.map((team) => [team.equipe_id, teamIdFromGloboTeam(team)])
  );

  const groups = globoGroups
    .map((group) => {
      const code = groupCodeFromGloboGroup(group);
      if (!code) {
        throw new Error(`Missing group code for nome_grupo=${JSON.stringify(group?.nome_grupo)}`);
      }

      const teamIds = (group?.classificacao ?? []).map((entry) => {
        const id = globoTeamIdByEquipeId.get(entry?.equipe_id);
        if (!id) {
          throw new Error(
            `Unknown equipe_id=${JSON.stringify(entry?.equipe_id)} for group ${code}`
          );
        }
        return id;
      });

      return { code, teamIds };
    })
    .sort((a, b) => a.code.localeCompare(b.code));

  const output = `import type { Group, Team } from "@/types/predictions";

export const teams: Team[] = ${JSON.stringify(teams, null, 2)};

export const groups: Group[] = ${JSON.stringify(groups, null, 2)};
`;

  process.stdout.write(output);
}

main();

