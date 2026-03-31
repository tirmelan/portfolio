// Kjør med: node scripts/import-kulturstudier.mjs
// Krever SANITY_API_TOKEN i .env.local (Editor-tilgang)

import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path";

// Last inn .env.local
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

// ─── Bilder fra Figma (utløper om 7 dager) ───────────────────────────────────
const IMGS = {
  header:  "https://www.figma.com/api/mcp/asset/3e6ba268-d23a-4be9-8134-64af96d55053",
  hoved2:  "https://www.figma.com/api/mcp/asset/7bc327fc-e026-422d-a78c-5aa9179bc7e3",
  pair1a:  "https://www.figma.com/api/mcp/asset/384df722-e514-4d9d-8f50-c4e6ff7081ba",
  pair1b:  "https://www.figma.com/api/mcp/asset/5c918aef-8c59-413e-b699-c34c7b959555",
  logo1:   "https://www.figma.com/api/mcp/asset/88df12ee-aede-42c6-9b8d-5cf72c7e74b8",
  logo2:   "https://www.figma.com/api/mcp/asset/32ba6bce-e665-46e1-bca3-21ee2112e03b",
  kv2L:    "https://www.figma.com/api/mcp/asset/4c05c260-8c8d-469e-b62e-c7bffdbc6962",
  kv2R:    "https://www.figma.com/api/mcp/asset/c1a06a08-3d43-4432-9b23-4c4874fd16aa",
  tre1a:   "https://www.figma.com/api/mcp/asset/dc4d17c9-e852-49dc-8b8b-5eaea6371e21",
  tre1b:   "https://www.figma.com/api/mcp/asset/73d78a19-ebfe-47f3-bc77-a9019c950696",
  tre1c:   "https://www.figma.com/api/mcp/asset/63b1cc7b-3941-4226-a78a-cd287d2ed475",
  tre2a:   "https://www.figma.com/api/mcp/asset/80bc9271-41fc-4a38-a3de-d244f39da81e",
  tre2b:   "https://www.figma.com/api/mcp/asset/5b8a5b0a-bebb-40d1-8fbe-976a2595bce8",
  tre2c:   "https://www.figma.com/api/mcp/asset/74af5a33-49fc-49eb-b5b2-11b87ee33158",
  pair2a:  "https://www.figma.com/api/mcp/asset/e351b828-3f4f-40c5-8fff-38d6214d9a50",
  pair2b:  "https://www.figma.com/api/mcp/asset/4f0325f8-042a-42a2-9709-4c37735066c3",
  kart:    "https://www.figma.com/api/mcp/asset/589c5150-e1a8-44b0-b31b-8406dd6646ff",
};

// ─── Hjelpefunksjoner ─────────────────────────────────────────────────────────

async function uploadImage(url, filename, retries = 5) {
  console.log(`  📸 Laster opp ${filename}...`);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const asset = await client.assets.upload("image", buffer, {
        filename,
        contentType: res.headers.get("content-type") || "image/jpeg",
      });
      return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    } catch (err) {
      if (attempt < retries) {
        console.log(`     ⚠️  Feil, prøver igjen (${attempt}/${retries})...`);
        const wait = 3000 * attempt;
        console.log(`     ⚠️  Feil, venter ${wait / 1000}s før nytt forsøk (${attempt}/${retries})...`);
        await new Promise((r) => setTimeout(r, wait));
      } else {
        throw err;
      }
    }
  }
}

async function findOrCreateTag(name, color) {
  const existing = await client.fetch(`*[_type == "tag" && name == $name][0]`, { name });
  if (existing) {
    console.log(`  🏷️  Fant eksisterende tag: ${name}`);
    return { _type: "reference", _ref: existing._id, _key: randomUUID() };
  }
  const tag = await client.create({ _type: "tag", name, color });
  console.log(`  🏷️  Opprettet tag: ${name}`);
  return { _type: "reference", _ref: tag._id, _key: randomUUID() };
}

function block(...texts) {
  return texts.map((text) => ({
    _type: "block",
    _key: randomUUID(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomUUID(), text, marks: [] }],
  }));
}

function bulletPlain(text) {
  return {
    _type: "block",
    _key: randomUUID(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: randomUUID(), text, marks: [] }],
  };
}

function textBlock(title, body, storTittel = true) {
  return { _type: "textBlock", _key: randomUUID(), title, storTittel, body };
}

function imgSingle(imageRef) {
  return { _type: "imageBlock", _key: randomUUID(), layout: "hovedbilde", image: imageRef };
}

function imgMulti(layout, imageRefs, position = "venstre") {
  return {
    _type: "imageBlock",
    _key: randomUUID(),
    layout,
    position,
    images: imageRefs.map((ref) => ({ _key: randomUUID(), image: ref, alt: "" })),
  };
}

// ─── Hoved ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Starter import av Kulturstudier...\n");

  // 1. Tags
  console.log("Oppretter tags...");
  const tags = await Promise.all([
    findOrCreateTag("Konseptuelle skisser", "rosa"),
    findOrCreateTag("Visuell identitet", "gul"),
  ]);

  // 2. Bilder (sekvensielt for å unngå SSL-feil)
  console.log("\nLaster opp bilder...");
  const header = await uploadImage(IMGS.header, "ks-header.jpg");
  const hoved2 = await uploadImage(IMGS.hoved2, "ks-hoved2.jpg");
  const pair1a = await uploadImage(IMGS.pair1a, "ks-par1a.jpg");
  const pair1b = await uploadImage(IMGS.pair1b, "ks-par1b.jpg");
  const logo1  = await uploadImage(IMGS.logo1,  "ks-logo1.jpg");
  const logo2  = await uploadImage(IMGS.logo2,  "ks-logo2.jpg");
  const kv2L   = await uploadImage(IMGS.kv2L,   "ks-kv2-venstre.jpg");
  const kv2R   = await uploadImage(IMGS.kv2R,   "ks-kv2-hoyre.jpg");
  const tre1a  = await uploadImage(IMGS.tre1a,  "ks-tre1a.jpg");
  const tre1b  = await uploadImage(IMGS.tre1b,  "ks-tre1b.jpg");
  const tre1c  = await uploadImage(IMGS.tre1c,  "ks-tre1c.jpg");
  const tre2a  = await uploadImage(IMGS.tre2a,  "ks-tre2a.jpg");
  const tre2b  = await uploadImage(IMGS.tre2b,  "ks-tre2b.jpg");
  const tre2c  = await uploadImage(IMGS.tre2c,  "ks-tre2c.jpg");
  const pair2a = await uploadImage(IMGS.pair2a, "ks-par2a.jpg");
  const pair2b = await uploadImage(IMGS.pair2b, "ks-par2b.jpg");
  const kart   = await uploadImage(IMGS.kart,   "ks-kart.jpg");

  // 3. Opprett prosjektet
  console.log("\nOppretter prosjektdokument...");
  const project = await client.create({
    _type: "project",
    clientName: "Kulturstudier",
    title: "Visuell identitet for utdanningsorganisasjon",
    slug: { _type: "slug", current: "kulturstudier" },
    tags,
    headerImage: header,
    lenke: "https://www.kulturstudier.no/",

    ingress:
      "Som lærling fikk jeg i oppdrag å utvikle en konseptuell retning for Kulturstudiers nye visuelle identitet. Organisasjonen tilbyr utenlandsstudier i Asia, Afrika og Latin-Amerika, og trengte et tydeligere, mer tillitsvekkende uttrykk som gjorde informasjonen lettere tilgjengelig for potensielle studenter.\n\nKonseptet mitt, som la vekt på klarhet, troverdighet og internasjonalt engasjement, ble valgt og videreutviklet til en komplett visuell identitet.",

    kundeLabel: "Kunde",
    kunde:      "Kulturstudier (via Kult Byrå)",
    samarbeid:  "Arbeid gjort som lærling i Kult Byrå",
    leveranse:  "Konseptuelle skisser og visuell identitet",
    periode:    "2024",

    sections: [
      imgSingle(hoved2),

      textBlock("Utfordring", [
        ...block("Prosjektet startet med en oppstartsworkshop, der vi ble bedre kjent med Kulturstudiers utfordringer og visjoner. Den eksisterende visuelle identiteten hadde noen elementer som kunne forbedres for å styrke brukeropplevelsen og organisasjonens troverdighet:"),
        bulletPlain("Ulike farger, typografi og grafiske elementer ble brukt inkonsistent, på grunn av manglende designmanual."),
        bulletPlain("Den brede oransje fargepaletten skapte utfordringer for visuell tydelighet og universell utforming (UU)."),
        bulletPlain("Informasjonsstrukturen kunne gjøres mer oversiktlig, slik at målgruppen lettere finner og forstår faglig innhold."),
        bulletPlain("Det var rom for å redusere frafall i søknadsprosessen gjennom tydeligere kommunikasjon."),
        ...block("Dette viste behovet for en ny visuell identitet som kunne danne grunnlag for nettside og markedsføring, styrke troverdigheten, tydeliggjøre verdigrunnlaget – utforskende, interessant og trygg – og samtidig bevare deler av eksisterende merkekjennskap."),
      ], true),

      // Kvadrat venstre + rektangel høyre
      imgMulti("kvadratRektangel", [pair1a, pair1b], "venstre"),

      imgMulti("toKvadratiske", [logo1, logo2]),

      textBlock("Konseptuell retning: moderne akademisk", [
        ...block("Basert på innsikt fra oppstartsworkshopen utviklet jeg konseptet «Moderne akademisk» for å styrke tilliten til Kulturstudier og gjøre informasjonen mer oversiktlig. Uttrykket balanserer struktur og profesjonalitet med varme og tilgjengelighet."),
        ...block("Fargepaletten er inspirert av landenes flagg og tilpasset for universell utforming. Dette forsterker både kulturell tilhørighet og gir navigasjonen et funksjonelt løft. Runde hjørner og myke farger virker trygghetsskapende, mens realistiske bilder av studenter og hverdagsliv gir et troverdig og gjenkjennelig inntrykk."),
        ...block("Oversiktlige moduler med fargede rammer organiserer innholdet og gjør viktig informasjon enkel å finne, noe som motvirker informasjonsoverbelastning. Moderne, ryddig typografi og helhetlig struktur understreker det akademiske og sikrer at Kulturstudier oppleves som en seriøs, tilgjengelig og relevant aktør for målgruppen."),
      ], false),

      imgMulti("kvadratRektangel", [kv2L, kv2R], "venstre"),

      imgMulti("treKvadratiske", [tre1a, tre1b, tre1c]),

      textBlock("Fra konsept til ferdig identitet", [
        ...block("Konseptet ble presentert sammen med to andre retninger utviklet av en annen designer i teamet, og «Moderne akademisk» ble valgt som det endelige konseptet for Kulturstudier. Den eneste tilbakemeldingen var å legge til en pil fra en av de andre retningene for å gjøre uttrykket mer dynamisk."),
        ...block("Etter at endringen ble implementert, ble det laget en designmanual. Denne gir både Kulturstudier og designeren som skulle stå for prototypen en tydelig oversikt over hvordan konseptet skal – og ikke skal – brukes, slik at identiteten kan implementeres konsekvent og effektivt."),
      ], false),

      imgMulti("treKvadratiske", [tre2a, tre2b, tre2c]),

      imgMulti("toKvadratiske", [pair2a, pair2b]),

      textBlock("Kart", [
        ...block("En annen leveranse for Kulturstudier har vært kart i samme stil som den nye visuelle identiteten. Kartene viser både et verdenskart og studieland, med markører for studiesteder og større byer eller hovedsteder."),
        ...block("Kartene ble først tracet i Illustrator, før de ble overført til Figma. Dette gjorde det mulig å tilpasse navnemarkørene enkelt ved hjelp av komponenter med auto-layout, slik at kartene kunne justeres raskt, produseres tidseffektivt og implementeres direkte i prototyper."),
      ], false),

      imgSingle(kart),

      textBlock("Resultat", [
        ...block("Det har vært givende å følge konseptet «Moderne akademisk» fra de første skissene til ferdig nettside. Gjennom samarbeid og sparring mellom teamet bak konseptene og designeren av prototypen ble flere ideer kombinert til en helhetlig løsning."),
        ...block("Å se hvordan felles tankeprosesser resulterte i en funksjonell, brukervennlig og visuelt tydelig identitet og nettside har vært både lærerikt og inspirerende."),
      ], false),

      imgSingle(header),
    ],
  });

  console.log(`\n✅ Ferdig! Prosjekt opprettet med ID: ${project._id}`);
  console.log(`👉 Åpne i Studio: http://localhost:3000/studio`);
  console.log(`👉 Se siden på: http://localhost:3000/prosjekter/kulturstudier`);
}

main().catch((err) => {
  console.error("❌ Feil:", err.message);
  process.exit(1);
});
