// Konverterer alle textBlockLiten → textBlock med storTittel: false
// Kjør med: node scripts/migrate-textBlockLiten.mjs
// Krever SANITY_API_TOKEN i .env.local (Editor-tilgang)

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const token = env.SANITY_API_TOKEN;
if (!token) {
  console.error("❌ Mangler SANITY_API_TOKEN i .env.local");
  console.error("   Gå til sanity.io → prosjektet → API → Tokens → legg til Editor-token");
  process.exit(1);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  token,
  useCdn: false,
});

// Hent alle prosjekter som har textBlockLiten i sections
const projects = await client.fetch(
  `*[_type == "project"] { _id, clientName, sections }`
);

const affected = projects.filter((p) =>
  p.sections?.some((s) => s._type === "textBlockLiten")
);

if (affected.length === 0) {
  console.log("✅ Ingen prosjekter med textBlockLiten funnet — ingenting å gjøre.");
  process.exit(0);
}

console.log(`Fant ${affected.length} prosjekt(er) med textBlockLiten:\n`);

for (const project of affected) {
  const liten = project.sections.filter((s) => s._type === "textBlockLiten");
  console.log(`  • ${project.clientName} — ${liten.length} blokk(er)`);
}

console.log("\nStarter migrering...\n");

for (const project of affected) {
  const oppdaterteSections = project.sections.map((section) => {
    if (section._type !== "textBlockLiten") return section;
    return {
      ...section,
      _type: "textBlock",
      storTittel: false,
    };
  });

  await client.patch(project._id).set({ sections: oppdaterteSections }).commit();
  console.log(`✅ ${project.title} oppdatert`);
}

console.log("\n🎉 Ferdig! Alle textBlockLiten er nå textBlock med storTittel: false.");
console.log("   Du kan nå fjerne textBlockLiten fra schemaTypes/project.ts og index.ts.");
