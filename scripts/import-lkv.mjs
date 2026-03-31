// Kjør med: node scripts/import-lkv.mjs
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
  header:  "https://www.figma.com/api/mcp/asset/c41f1838-985f-45a3-8523-c6a5f97e56ee",
  pair1a:  "https://www.figma.com/api/mcp/asset/6e3695cb-0381-452d-adec-2f303dd9da7e",
  pair1b:  "https://www.figma.com/api/mcp/asset/8d4e7580-d12d-4786-8b8b-9920df48410b",
  kv1L:    "https://www.figma.com/api/mcp/asset/794f6117-bbe6-4b87-93e7-3334ce7efeab",
  kv1R:    "https://www.figma.com/api/mcp/asset/83886fdc-2c52-492f-a169-e534dd7237d9",
  rect1a:  "https://www.figma.com/api/mcp/asset/471d4404-e285-4596-bea6-a86e4caab067",
  rect1b:  "https://www.figma.com/api/mcp/asset/2d9987eb-945e-4b0f-a7d5-174c3b508270",
  hoved1:  "https://www.figma.com/api/mcp/asset/606cb9ac-199c-4f6d-b570-9d4a62872dcb",
  tre1:    "https://www.figma.com/api/mcp/asset/9b27899b-bca2-4043-ad39-f4db499fc587",
  tre2:    "https://www.figma.com/api/mcp/asset/cdb15ac7-74b9-4a70-afbd-b4c99041e7bc",
  tre3:    "https://www.figma.com/api/mcp/asset/57ab1434-5638-4413-b8f3-b950a46641c5",
  hoved2:  "https://www.figma.com/api/mcp/asset/c6448fe3-e13e-4e67-9927-980e8f650a9a",
  rect2a:  "https://www.figma.com/api/mcp/asset/15b93041-d42e-42de-8c4b-8184f4ff16a4",
  rect2b:  "https://www.figma.com/api/mcp/asset/8643e407-a2d0-4073-8976-2471279d575b",
  rect3a:  "https://www.figma.com/api/mcp/asset/34145ea5-bcf3-443a-b471-8cd2a67c1792",
  rect3b:  "https://www.figma.com/api/mcp/asset/381898ac-67c9-48bb-b98b-02ebbd9ad409",
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
      // Liten pause etter vellykket opplasting
      await new Promise((r) => setTimeout(r, 800));
      return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    } catch (err) {
      if (attempt < retries) {
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
  console.log("🚀 Starter import av LKV...\n");

  // 1. Tags
  console.log("Oppretter tags...");
  const tags = await Promise.all([
    findOrCreateTag("Logo", "mellombla"),
  ]);

  // 2. Bilder (sekvensielt for å unngå SSL-feil)
  console.log("\nLaster opp bilder...");
  const header = await uploadImage(IMGS.header, "lkv-header.jpg");
  const pair1a = await uploadImage(IMGS.pair1a, "lkv-par1a.jpg");
  const pair1b = await uploadImage(IMGS.pair1b, "lkv-par1b.jpg");
  const kv1L   = await uploadImage(IMGS.kv1L,   "lkv-kv1-venstre.jpg");
  const kv1R   = await uploadImage(IMGS.kv1R,   "lkv-kv1-hoyre.jpg");
  const rect1a = await uploadImage(IMGS.rect1a, "lkv-rekt1a.jpg");
  const rect1b = await uploadImage(IMGS.rect1b, "lkv-rekt1b.jpg");
  const hoved1 = await uploadImage(IMGS.hoved1, "lkv-hoved1.jpg");
  const tre1   = await uploadImage(IMGS.tre1,   "lkv-tre1.jpg");
  const tre2   = await uploadImage(IMGS.tre2,   "lkv-tre2.jpg");
  const tre3   = await uploadImage(IMGS.tre3,   "lkv-tre3.jpg");
  const hoved2 = await uploadImage(IMGS.hoved2, "lkv-hoved2.jpg");
  const rect2a = await uploadImage(IMGS.rect2a, "lkv-rekt2a.jpg");
  const rect2b = await uploadImage(IMGS.rect2b, "lkv-rekt2b.jpg");
  const rect3a = await uploadImage(IMGS.rect3a, "lkv-rekt3a.jpg");
  const rect3b = await uploadImage(IMGS.rect3b, "lkv-rekt3b.jpg");

  // 3. Opprett prosjektet
  console.log("\nOppretter prosjektdokument...");
  const project = await client.create({
    _type: "project",
    clientName: "Lademoen Kunstnerverksteder",
    title: "En logo med historie og fellesskap",
    slug: { _type: "slug", current: "lkv" },
    tags,
    headerImage: header,

    ingress:
      "Lademoen Kunstnerverksteder (LKV) er et levende kunstnerfellesskap i Trondheim, kjent for sitt internasjonale samarbeid og inkluderende kunstnermiljø.\n\nJeg fikk i oppgave å utvikle en ny logo som både forener byggets historiske betydning og ivaretar kunstnernes unike tradisjoner. Målet var å skape et uttrykk som er gjenkjennelig og fleksibelt, og som tydelig bygger videre på det ikoniske bygget som er selve kjernen i LKV sin identitet.",

    kundeLabel: "Kunde",
    kunde:      "Lademoen Kunstnerveksteder (via Kult Byrå)",
    samarbeid:  "Arbeid gjort som lærling i Kult Byrå",
    leveranse:  "Logo",
    periode:    "2024/2025",

    sections: [
      imgMulti("toKvadratiske", [pair1a, pair1b]),

      textBlock("Utfordring", [
        ...block("Til tross for et sterkt fellesskap har Lademoen Kunstnerverksteder hatt utfordringer med synlighet og identitet. Navnet «Lademoen Kunstnerverksteder» brukes om hverandre med forkortelsen «LKV», ofte uten en konsekvent linje. For mange oppleves navnet som langt, og det er krevende å uttale og skrive, særlig for internasjonale."),
        ...block("Den tidligere logoen har også vært lite fleksibel, vanskelig å tilpasse ulike flater og har ikke klart å representere kvaliteten i virksomheten. Dette har ført til lav visuell gjenkjennelse og begrenset fleksibilitet i identiteten."),
      ], true),

      imgMulti("kvadratRektangel", [kv1L, kv1R], "venstre"),

      textBlock("Elefanten – et symbol på fellesskap", [
        ...block("Gjennom workshops med kunstnerne kom det frem at elefanten har en spesiell intern betydning for LKV. Hver gang en kunstner kommer til huset fra et nytt sted, tar de med en liten elefant fra sitt hjemland. Dette har blitt et unikt symbol på fellesskap og inkludering, og skapte interesse hos meg for å hente dette inn i logoen."),
      ], true),

      imgMulti("toRektangulare", [rect1a, rect1b]),

      textBlock("Konseptuelle skisser", [
        ...block("Den nye visuelle identiteten tar utgangspunkt i det ikoniske bygget i Trondheim, og det var viktig at logoen skulle passe inn i denne helheten. Arbeidet startet med fire konsepter, fra enkle til eksperimentelle uttrykk: plantegning, fasade, minimalistiske former og mer detaljerte illustrasjoner."),
        ...block("I den eksperimentelle varianten valgte jeg å integrere elefanten i plantegningen, noe som tilførte både symbolikk og lekenhet. Etter diskusjon i LKV, ble dette konseptet valgt videre fordi det gir rom for både historie og følelser."),
      ], true),

      imgSingle(hoved1),

      textBlock("Videreutvikling og detaljering", [
        ...block("Videre i prosessen bearbeidet og raffinerte jeg det valgte konseptet. Det ble jobbet frem tre varianter, hvor små endringer som hale, innrykk i ryggen og proporsjoner ga alternative uttrykk uten å gå på bekostning av helheten."),
        ...block("Den endelige logoen er en videreutvikling av det første forslaget, med en balanse mellom elefanten og plantegningens former."),
      ], true),

      imgMulti("treKvadratiske", [tre1, tre2, tre3]),

      textBlock("Fleksibilitet og variasjon", [
        ...block("For å sikre at logoen fungerer i alle sammenhenger, har jeg utviklet et fleksibelt logosystem. Symbolet kan brukes alene, sammen med fullt navn, forkortelsen LKV eller tilhørende avdelinger. Det er også lagt vekt på en orddeling som gjør navnet enklere å lese og uttale."),
        ...block("Logoen fungerer like godt i sort/hvitt som med hver av de individuelle avdelingenes egne farger. Dette gir LKV en tydelig og fleksibel identitet med stor frihet i bruk, samtidig som sammenhengen til den nye profilen bevares."),
      ], true),

      imgSingle(header),

      textBlock("Resultat", [
        ...block("Resultatet er en logo som kombinerer det ikoniske bygget med elefanten, og viser både LKV sin historie og fellesskap blant kunstnerne."),
        ...block("Den nye logoen løser utfordringene ved å være sterkt gjenkjennelig og unik, samtidig som den er enkel å bruke på tvers av ulike flater og sammenhenger. Plantegningens linjer og elefantens form smelter sammen i et symbol som rommer både institusjonens historiske forankring og åpne, kunstnerdrevne karakter."),
        ...block("Slik får LKV et logo som gir rom for tradisjon, tilhørighet og fremtidige behov."),
      ], true),

      imgSingle(hoved2),

      imgMulti("toRektangulare", [rect2a, rect2b]),

      imgMulti("toRektangulare", [rect3a, rect3b]),
    ],
  });

  console.log(`\n✅ Ferdig! Prosjekt opprettet med ID: ${project._id}`);
  console.log(`👉 Åpne i Studio: http://localhost:3000/studio`);
  console.log(`👉 Se siden på: http://localhost:3000/prosjekter/lkv`);
}

main().catch((err) => {
  console.error("❌ Feil:", err.message);
  process.exit(1);
});
