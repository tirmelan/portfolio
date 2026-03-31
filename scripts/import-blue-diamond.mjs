// Kjør med: node scripts/import-blue-diamond.mjs
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
  header:     "https://www.figma.com/api/mcp/asset/c0bff7bf-335b-4c78-bdd9-b935e7c8d795",
  pair1a:     "https://www.figma.com/api/mcp/asset/285e54d6-0e2e-4896-8959-d7b6b4b713ba",
  pair1b:     "https://www.figma.com/api/mcp/asset/e2046343-1ad5-49e4-bd9d-48910944d464",
  image11:    "https://www.figma.com/api/mcp/asset/dc420c28-0df1-4e5b-b037-b83cb0e74bb6",
  rect1a:     "https://www.figma.com/api/mcp/asset/2e7fcf24-22f3-41c6-add0-7f6ea0fa160d",
  rect1b:     "https://www.figma.com/api/mcp/asset/91571839-8f2a-44fa-aa55-8041a017e8cf",
  rect2a:     "https://www.figma.com/api/mcp/asset/4a44eca2-644f-47c3-bea5-a0c7be8267cf",
  rect2b:     "https://www.figma.com/api/mcp/asset/2f56ab8c-58aa-442e-9ba6-844b91cd8dcf",
  grid65:     "https://www.figma.com/api/mcp/asset/eed912b2-5e0c-4828-8947-7c75f9bb67ee",
  grid66:     "https://www.figma.com/api/mcp/asset/0fe84adb-5710-48d4-9a28-11427b11bbc0",
  grid67:     "https://www.figma.com/api/mcp/asset/0a265b1b-547b-4c88-a4c2-8014238e32d3",
  grid68:     "https://www.figma.com/api/mcp/asset/183f17f8-9513-4836-bf8b-efa1ce409ae5",
  solBig:     "https://www.figma.com/api/mcp/asset/eb49f859-decb-40f1-8f24-fdc76f61c1cc",
  solSm1:     "https://www.figma.com/api/mcp/asset/07eff7fe-ce8e-4351-824b-abac7a11c934",
  solSm2:     "https://www.figma.com/api/mcp/asset/c9d07d78-2df5-4c42-a457-4213ae1796e9",
  image14:    "https://www.figma.com/api/mcp/asset/3dea0df2-020b-41c3-a8fe-72910142a911",
  image15:    "https://www.figma.com/api/mcp/asset/a6fd104d-ac84-498a-97e7-8f25e6103cc6",
  finalL:     "https://www.figma.com/api/mcp/asset/44cc895b-5c28-4854-8b73-7c834d3467b4",
  finalR:     "https://www.figma.com/api/mcp/asset/3ab97fe1-fa63-422e-9d9f-67e61efa39f4",
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

function bulletBlock(boldText, rest = "") {
  const children = [
    { _type: "span", _key: randomUUID(), text: boldText, marks: ["strong"] },
  ];
  if (rest) children.push({ _type: "span", _key: randomUUID(), text: rest, marks: [] });
  return {
    _type: "block",
    _key: randomUUID(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children,
  };
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
  console.log("🚀 Starter import av Blue Diamond...\n");

  // 1. Tags
  console.log("Oppretter tags...");
  const tags = await Promise.all([
    findOrCreateTag("Visuell identitet", "gul"),
    findOrCreateTag("Strategi", "rosa"),
    findOrCreateTag("Emballasjedesign", "mellombla"),
  ]);

  // 2. Bilder (sekvensielt for å unngå SSL-feil)
  console.log("\nLaster opp bilder...");
  const header  = await uploadImage(IMGS.header,  "bd-header.jpg");
  const pair1a  = await uploadImage(IMGS.pair1a,  "bd-par1a.jpg");
  const pair1b  = await uploadImage(IMGS.pair1b,  "bd-par1b.jpg");
  const image11 = await uploadImage(IMGS.image11, "bd-image11.jpg");
  const rect1a  = await uploadImage(IMGS.rect1a,  "bd-rekt1a.jpg");
  const rect1b  = await uploadImage(IMGS.rect1b,  "bd-rekt1b.jpg");
  const rect2a  = await uploadImage(IMGS.rect2a,  "bd-rekt2a.jpg");
  const rect2b  = await uploadImage(IMGS.rect2b,  "bd-rekt2b.jpg");
  const grid65  = await uploadImage(IMGS.grid65,  "bd-grid1.jpg");
  const grid66  = await uploadImage(IMGS.grid66,  "bd-grid2.jpg");
  const grid67  = await uploadImage(IMGS.grid67,  "bd-grid3.jpg");
  const grid68  = await uploadImage(IMGS.grid68,  "bd-grid4.jpg");
  const solBig  = await uploadImage(IMGS.solBig,  "bd-sol-stor.jpg");
  const solSm1  = await uploadImage(IMGS.solSm1,  "bd-sol-liten1.jpg");
  const solSm2  = await uploadImage(IMGS.solSm2,  "bd-sol-liten2.jpg");
  const image14 = await uploadImage(IMGS.image14, "bd-image14.jpg");
  const image15 = await uploadImage(IMGS.image15, "bd-image15.jpg");
  const finalL  = await uploadImage(IMGS.finalL,  "bd-final-venstre.jpg");
  const finalR  = await uploadImage(IMGS.finalR,  "bd-final-hoyre.jpg");

  // 3. Opprett prosjektet
  console.log("\nOppretter prosjektdokument...");
  const project = await client.create({
    _type: "project",
    clientName: "Blue Diamond",
    title: "Fra ruskete emballasje til folkefavoritt",
    slug: { _type: "slug", current: "blue-diamond" },
    tags,
    headerImage: header,

    ingress:
      "I emnet strategisk design var oppgaven å redesigne et dagligvareprodukt. Jeg valgte mandelflak fra Blue Diamond – et kvalitetsprodukt fanget i en utdatert og frustrerende emballasje. Produktet, slik det fremstod i butikken, levde rett og slett ikke opp til sin egen kvalitet.\n\nMålet mitt var å gi produktet et fullstendig designløft for det norske markedet, med fokus på bedre brukervennlighet og bærekraft.",

    kundeLabel: "Kunde",
    kunde:      "Blue Diamond Almonds",
    samarbeid:  "Semesteroppgave i strategisk design ved USN",
    leveranse:  "Redesign av visuell identitet og strategi",
    periode:    "2022",

    sections: [
      imgMulti("toKvadratiske", [pair1a, pair1b]),

      textBlock("Utfordring", [
        ...block("Den originale emballasjen hadde flere fundamentale svakheter som skapte en dårlig brukeropplevelse og undergravde produktets verdi i butikkhyllen."),
        bulletBlock("Funksjonell svikt og dårlig brukervennlighet", ": Posen manglet grunnleggende funksjoner som åpne- og lukkemekanisme. Dette gjorde den vanskelig å porsjonere fra uten søl, og umulig å forsegle for å bevare produktets ferskhet. Resultatet var en frustrerende brukeropplevelse og økt risiko for matsvinn."),
        bulletBlock("Sprik mellom pris og oppfattet kvalitet", ": Designet klarte ikke å kommunisere produktets premium-kvalitet. Analyser viste at emballasjens uttrykk skapte lavpris-assosiasjoner, noe som resulterte i et stort sprik mellom kundenes prisforventning og den faktiske prisen i butikk. Emballasjen forsvarte rett og slett ikke sin egen prislapp."),
        bulletBlock("Manglende synlighet i butikk", ": Produktet slet med svært dårlig synlighet, både på grunn av feilplassering i butikken og emballasjens fysiske form. Den ustabile posen kunne ikke stå oppreist, noe som ga et rotete hylleuttrykk og gjorde den vanskelig å oppdage. I praksis var produktet nesten usynlig for kunder som ikke aktivt lette etter det."),
      ], true),

      imgSingle(image11),

      textBlock("Fra pose til smart kartong", [
        ...block("Den største og viktigste endringen var å bytte ut den upraktiske plastposen med en smart, resirkulerbar kartong. Denne nye formen løser alle de funksjonelle problemene:"),
        bulletPlain("Den står stødig i skapet."),
        bulletPlain("Den har en praktisk tut som gjør det enkelt å helle og måle opp uten søl."),
        bulletPlain("Den kan lukkes igjen, slik at produktet holder seg ferskt."),
      ], false),

      imgMulti("toRektangulare", [rect1a, rect1b]),

      textBlock("Design som forteller en historie", [
        ...block("Jeg ga emballasjen et mer folkelig uttrykk ved å la en illustrert tidslinje bære hele designet. Rundt kartongen følger en enkel sekvens: jord, trær, stell og høsting – videre til foredling og til slutt mandelflak på kjøkkenbenken. Fortellingen kan leses uten tekst, fungerer fra flere vinkler i hyllen, og gjør at produktet møter kunden med noe gjenkjennelig og jordnært."),
        ...block("Stilen er bevisst uformell: håndtegnet strek, dempede farger og små ikoniske detaljer (tre, sol, kurv, diamant). Det senker terskelen for forståelse, bygger tillit og bryter med det glansede, amerikanske uttrykket. Resultatet er en emballasje som både informerer og inviterer – en vennlig stemme som gjør at Blue Diamond oppleves nærmere, varmere og mer relevant for norske kjøkken."),
      ], false),

      // To rader med to rektangulære bilder (2×2-rutenett)
      imgMulti("toRektangulare", [rect2a, rect2b]),
      imgMulti("toRektangulare", [grid65, grid68]),
      imgMulti("toRektangulare", [grid67, grid66]),

      textBlock("Tydelig og ærlig kommunikasjon", [
        ...block("All unødvendig «støy» fra det gamle designet ble fjernet. Den nye emballasjen har klar og tydelig informasjon på norsk, enkel miljømerking, og et rent design som gjør det lett å forstå hva produktet er og hva det kan brukes til."),
      ], false),

      // Stor til venstre + to små til høyre
      imgMulti("storOgLiten", [solBig, solSm1, solSm2], "venstre"),

      // Smal portrett til venstre + bred landskap til høyre
      imgMulti("storOgLiten", [image14, image15], "hoyre"),

      textBlock("Resultat av redesign", [
        ...block("Det nye designet gir en helhetlig løsning på de identifiserte utfordringene, med konkrete forbedringer for både brukeren og merkevaren."),
        ...block("Den nye kartongen gir en betydelig forbedret brukeropplevelse. Med en praktisk helletut er det nå enkelt å porsjonere mandlene, enten man skal ha en liten neve som snacks eller måle opp nøyaktig til baking – helt uten søl. Den gjenlukkbare funksjonen sørger også for at produktet holder seg ferskt lenger."),
        ...block("Ved å bytte fra plastpose til en resirkulerbar kartong med tydelig miljømerking, fremstår produktet nå som et mer bærekraftig og ansvarlig valg."),
        ...block("Samlet sett har disse forbedringene resultert i et produkt som er mer funksjonelt, attraktivt og troverdig. Emballasjen kommuniserer nå den kvaliteten produktet faktisk har, og gir merkevaren et solid grunnlag for å bygge tillit og konkurrere effektivt i det norske markedet."),
      ], false),

      imgMulti("toRektangulare", [finalL, finalR]),
    ],
  });

  console.log(`\n✅ Ferdig! Prosjekt opprettet med ID: ${project._id}`);
  console.log(`👉 Åpne i Studio: http://localhost:3000/studio`);
  console.log(`👉 Se siden på: http://localhost:3000/prosjekter/blue-diamond`);
}

main().catch((err) => {
  console.error("❌ Feil:", err.message);
  process.exit(1);
});
