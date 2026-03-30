// Kjør med: node scripts/import-bentes-fermentering.mjs
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
  header:     "https://www.figma.com/api/mcp/asset/94b32c41-0e00-4984-a0fc-f78d999917c2",
  seksjon1:   "https://www.figma.com/api/mcp/asset/b389c029-a4e2-40ff-9fd6-07ff0eaae158",
  g1a:        "https://www.figma.com/api/mcp/asset/9b0ce759-8c42-4899-88ce-7bab30715692",
  g1b:        "https://www.figma.com/api/mcp/asset/e3cf2161-0f50-4c3d-98a3-6ed1bd70f425",
  g1c:        "https://www.figma.com/api/mcp/asset/5f65b992-efcb-4c84-8525-8f1c2f86d07f",
  g1d:        "https://www.figma.com/api/mcp/asset/b4fb40db-a99f-415c-84c4-95206d1b3523",
  g2a:        "https://www.figma.com/api/mcp/asset/88438a24-7fd8-4eec-9e14-dc41e9018e4e",
  g2b:        "https://www.figma.com/api/mcp/asset/a5ff5ad6-a05c-472b-8a40-7cbd3b7b8cdd",
  g2c:        "https://www.figma.com/api/mcp/asset/2a2249b3-d821-4f9b-8344-19ddaf6178f9",
  g2d:        "https://www.figma.com/api/mcp/asset/994a0b38-c90c-4867-82d0-90372d3ed080",
  opp1:       "https://www.figma.com/api/mcp/asset/83ac9762-cc55-444a-a611-0ed62381e5c3",
  opp2:       "https://www.figma.com/api/mcp/asset/e9cb5fc5-a864-4184-b8f7-c34b142a75a1",
  nettside:   "https://www.figma.com/api/mcp/asset/838af2c0-fd27-4975-8a1f-5371844d2664",
  ns1:        "https://www.figma.com/api/mcp/asset/5f65f8c6-107f-4019-9ddc-580a37d4f3a3",
  ns2:        "https://www.figma.com/api/mcp/asset/ca3acf6a-2b68-419e-ae67-c1de76952be9",
  ns3:        "https://www.figma.com/api/mcp/asset/1c051193-ffaa-4133-a9d8-770984083bbc",
  ns4:        "https://www.figma.com/api/mcp/asset/caabf751-ee0a-4234-99be-9d837a58a42e",
  sanity:     "https://www.figma.com/api/mcp/asset/9d629914-9dc0-4618-8f29-bcf37265d6b6",
  resultat:   "https://www.figma.com/api/mcp/asset/47dca40d-156d-4ada-870b-0e194da2aff9",
};

// ─── Hjelpefunksjoner ─────────────────────────────────────────────────────────

async function uploadImage(url, filename, retries = 3) {
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
        await new Promise((r) => setTimeout(r, 2000 * attempt));
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

function textBlock(title, ...paragraphs) {
  return { _type: "textBlock", _key: randomUUID(), title, body: block(...paragraphs) };
}

function textBlockLiten(title, ...paragraphs) {
  return { _type: "textBlockLiten", _key: randomUUID(), title, body: block(...paragraphs) };
}

function imgSingle(imageRef) {
  return { _type: "imageBlock", _key: randomUUID(), layout: "hoofdbilde", image: imageRef };
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
  console.log("🚀 Starter import av Bentes fermentering...\n");

  // 1. Tags
  console.log("Oppretter tags...");
  const tags = await Promise.all([
    findOrCreateTag("Visuell identitet", "gul"),
    findOrCreateTag("Nettside", "burgunder"),
    findOrCreateTag("Oppskriftshefte", "mellombla"),
    findOrCreateTag("Sanity schema", "burgunder"),
  ]);

  // 2. Bilder (sekvensielt for å unngå SSL-feil)
  console.log("\nLaster opp bilder...");
  const headerImg    = await uploadImage(IMGS.header,   "bentes-header.jpg");
  const seksjon1Img  = await uploadImage(IMGS.seksjon1, "bentes-utfordring.jpg");
  const g1a          = await uploadImage(IMGS.g1a,      "bentes-losning-1.jpg");
  const g1b          = await uploadImage(IMGS.g1b,      "bentes-losning-2.jpg");
  const g1c          = await uploadImage(IMGS.g1c,      "bentes-losning-3.jpg");
  const g1d          = await uploadImage(IMGS.g1d,      "bentes-losning-4.jpg");
  const g2a          = await uploadImage(IMGS.g2a,      "bentes-losning-5.jpg");
  const g2b          = await uploadImage(IMGS.g2b,      "bentes-losning-6.jpg");
  const g2c          = await uploadImage(IMGS.g2c,      "bentes-losning-7.jpg");
  const g2d          = await uploadImage(IMGS.g2d,      "bentes-losning-8.jpg");
  const opp1         = await uploadImage(IMGS.opp1,     "bentes-oppskrift-1.jpg");
  const opp2         = await uploadImage(IMGS.opp2,     "bentes-oppskrift-2.jpg");
  const nettsideImg  = await uploadImage(IMGS.nettside, "bentes-nettside-header.jpg");
  const ns1          = await uploadImage(IMGS.ns1,      "bentes-nettside-1.jpg");
  const ns2          = await uploadImage(IMGS.ns2,      "bentes-nettside-2.jpg");
  const ns3          = await uploadImage(IMGS.ns3,      "bentes-nettside-3.jpg");
  const ns4          = await uploadImage(IMGS.ns4,      "bentes-nettside-4.jpg");
  const sanityImg    = await uploadImage(IMGS.sanity,   "bentes-sanity.jpg");
  const resultatImg  = await uploadImage(IMGS.resultat, "bentes-resultat.jpg");

  // 3. Opprett prosjektet
  console.log("\nOppretter prosjektdokument...");
  const project = await client.create({
    _type: "project",
    clientName: "Bentes fermentering",
    title: "Matglede på tvers av medier",
    slug: { _type: "slug", current: "bentes-fermentering" },
    tags,
    headerImage: headerImg,

    ingress:
      "Bentes fermentering formidler gleden ved fermentert mat – og ønsket en merkevare som speilet den samme varmen, kunnskapen og livsgleden som Bente selv står for. \n\nSom lærling i Kult Byrå fikk jeg ansvar for å utvikle en helhetlig løsning med redesign av visuell identitet, oppgradert nettside i Squarespace og nytt oppskriftshefte med Sanity-integrasjon. \n\nResultatet ble et friskere og mer tidsaktuelt uttrykk som gjør det enklere å inspirere flere til en sunnere livsstil.",

    kundeLabel: "Kunde",
    kunde:      "Bentes fermentering (via Kult Byrå)",
    samarbeid:  "Arbeid gjort som lærling i Kult Byrå",
    leveranse:  "Redesign av visuell identitet, nettside i Squarespace, oppskrifthefte med malsider og Sanity studio",
    periode:    "2024–d.d.",
    lenke:      "https://fermentering.com/",

    sections: [
      textBlock(
        "Utfordring",
        "I workshop ble jeg bedre kjent med Bente og hennes merkevare. Det ble tydelig at Bentes fermentering hadde en lojal følgerskare og høyt engasjement, men at den visuelle identiteten og nettsiden ikke lenger støttet veksten og ambisjonene. Profilen var utdatert og lite fleksibel, med begrenset fargebruk, utdaterte fonter og svak kontrast. Nettsiden lå på et eldre Squarespace-format, mens kursdelen lå i WordPress, noe som ga en fragmentert brukeropplevelse og tungvint redaktørflyt.",
        "Et annet tydelig funn var behovet for å formidle fermentering som matglede og nysgjerrighet, ikke diettkultur, gjennom et moderne og inviterende uttrykk.",
      ),
      imgSingle(seksjon1Img),
      textBlock(
        "Løsning",
        "Den nye visuelle identiteten er utviklet for å fremstå varm, tydelig og fleksibel, med et uttrykk som fungerer like godt på nettsiden som i kurs og oppskriftshefter. Målet var å gjøre fermentering mer inviterende og matgledefylt, samtidig som profilen skulle oppleves profesjonell og lett å bruke i ulike flater.",
        "Logoen er forenklet for å bevare særpreget også i små formater, mens layouten organiseres i tydelige faktabokser som skaper struktur og ro – særlig i oppskriftsheftet. Fargepaletten henter inspirasjon fra fermenterte råvarer og tilfører energi og liv, mens typografien gir et moderne og lesbart uttrykk, med gode bokstavformer for Æ, Ø og Å.",
        "Et sentralt grep er «det femte element» – et sirkulært merke med border hentet fra logoens kantlinje – som brukes på tvers av flater for å fremheve alt fra logosymbol til vanskelighetsgrad og korte fakta.",
      ),
      imgMulti("storOgLiten", [g1a, g1b, g1c, g1d]),
      imgMulti("storOgLiten", [g2a, g2b, g2c, g2d]),
      textBlockLiten(
        "Oppskriftshefte",
        "Oppskriftsheftet Fantastisk med fermentering inneholder oppskrifter for alt fra nybegynnere til viderekomne, og ble i forbindelse med ny visuell identitet oppdatert og relansert som en V2-versjon. Prosessen omfattet hele arbeidsflyten, fra å utvikle nødvendige malsider i InDesign, finskriving og oppdatering av oppskrifter, til overføring av innhold, trykk og publisering på nettsiden.",
        "Heftet har mottatt god respons, og de strukturerte malsidene, tilpasset Bentes formidlingsbehov, gjør det enkelt å produsere nye hefter fremover.",
      ),
      imgMulti("storOgLiten", [opp1, opp2]),
      imgSingle(nettsideImg),
      imgMulti("toKvadratiske", [ns1, ns2]),
      textBlockLiten(
        "Nettside i Squarespace",
        "Dette prosjektet innebar å oppgradere Bentes gamle Squarespace-nettside til versjon 7.1 for å få flere funksjoner og en enklere redaktørflyt.",
        "Den nye visuelle identiteten ble tatt i bruk med fokus på oversikt og et tydelig, eget uttrykk. Egne fonter ble lagt inn via custom code, kursdelen ble migrert fra WordPress, og domenet samt interne lenker ble ryddet opp, slik at publisering og navigasjon fungerer sømløst.",
      ),
      imgMulti("toRektangulare", [ns3, ns4]),
      textBlockLiten(
        "Sanity schema – effektiv produksjon",
        "For å forenkle produksjon av nye hefter og redusere behovet for manuelle korrekturrunder, utforsket vi et malbasert Sanity-schema. Målet var å lage et studio med modulbaserte dokumenttyper, på samme måte som malsidene i InDesign.",
        "Resultatet er et schema hvor Bente kan bygge hvert hefte modul for modul, legge inn tekst direkte og kombinere sider til komplette hefter. Valideringsregler holder tekstlengder i sjakk, samtidig som hun kan velge fargekombinasjoner som alltid følger universelle designprinsipper. Dette gir en fleksibel og effektiv arbeidsflyt, samtidig som Bente beholder full redaksjonell kontroll.",
        "Strukturert og modulært innhold gjør det enkelt å produsere nye hefter fremover, og neste steg er å teste om frontend kan bygges slik at heftene genereres automatisk og publiseres digitalt på nettsiden.",
      ),
      imgSingle(sanityImg),
      textBlockLiten(
        "Resultat",
        "Resultatet er en merkevare med tydeligere profil og høyere fleksibilitet på tvers av flater. Den nye identiteten treffer målgruppen bedre, uten å gi slipp på det opprinnelige uttrykket.",
        "Nettsiden gir nå en helhetlig, brukervennlig opplevelse der både kurs og oppskrifter er samlet på ett sted. Oppskriftsheftet er blitt mer fristende og brukervennlig, og arbeidet med innholdsproduksjon har blitt langt mer effektivt – slik at Bente kan bruke mer tid på å formidle matglede til flere.",
      ),
      imgSingle(resultatImg),
    ],
  });

  console.log(`\n✅ Ferdig! Prosjekt opprettet med ID: ${project._id}`);
  console.log(`👉 Åpne i Studio: http://localhost:3000/studio`);
}

main().catch((err) => {
  console.error("❌ Feil:", err.message);
  process.exit(1);
});
