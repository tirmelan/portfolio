// Kjør med: node scripts/import-collect.mjs
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
  header:  "https://www.figma.com/api/mcp/asset/5845325e-5802-4063-8291-f4fd767dbb44",
  solL:    "https://www.figma.com/api/mcp/asset/32a5ed78-1f5e-414a-9ab7-229ef762c0ef",
  solS:    "https://www.figma.com/api/mcp/asset/75a36ac1-9c26-4c61-ad3d-c673ed4ed8d5",
  pair1a:  "https://www.figma.com/api/mcp/asset/39044b9a-0dd2-4f2d-8383-fbfd876e5844",
  pair1b:  "https://www.figma.com/api/mcp/asset/c62f9b97-d670-4e09-af3a-26b3944ffa5a",
  rect1a:  "https://www.figma.com/api/mcp/asset/ac0e2d37-f58a-4ce9-b876-46c254b9bdbd",
  rect1b:  "https://www.figma.com/api/mcp/asset/20062ece-06ac-462f-8447-4f3a7daffeb8",
  hoved:   "https://www.figma.com/api/mcp/asset/736e7baa-61af-4119-9481-8427289c61c6",
  storL:   "https://www.figma.com/api/mcp/asset/ec816a24-cc6e-4e79-9745-f236a3055efd",
  storS:   "https://www.figma.com/api/mcp/asset/589a7007-5e8c-4a9b-a410-54b6be4673a6",
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

function boldBlock(text) {
  return {
    _type: "block",
    _key: randomUUID(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomUUID(), text, marks: ["strong"] }],
  };
}

function bulletBlock(text) {
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
  console.log("🚀 Starter import av Collect...\n");

  // 1. Tags
  console.log("Oppretter tags...");
  const tags = await Promise.all([
    findOrCreateTag("Visuell identitet", "gul"),
    findOrCreateTag("Strategi", "rosa"),
    findOrCreateTag("App", "burgunder"),
    findOrCreateTag("Markedsføringsmateriell", "mellombla"),
  ]);

  // 2. Bilder (sekvensielt for å unngå SSL-feil)
  console.log("\nLaster opp bilder...");
  const header = await uploadImage(IMGS.header, "collect-header.jpg");
  const solL   = await uploadImage(IMGS.solL,   "collect-stor-og-liten-stor.jpg");
  const solS   = await uploadImage(IMGS.solS,   "collect-stor-og-liten-liten.jpg");
  const pair1a = await uploadImage(IMGS.pair1a, "collect-par1a.jpg");
  const pair1b = await uploadImage(IMGS.pair1b, "collect-par1b.jpg");
  const rect1a = await uploadImage(IMGS.rect1a, "collect-rekt1a.jpg");
  const rect1b = await uploadImage(IMGS.rect1b, "collect-rekt1b.jpg");
  const hoved  = await uploadImage(IMGS.hoved,  "collect-hovedbilde.jpg");
  const storL  = await uploadImage(IMGS.storL,  "collect-stor2-stor.jpg");
  const storS  = await uploadImage(IMGS.storS,  "collect-stor2-liten.jpg");

  // 3. Opprett prosjektet
  console.log("\nOppretter prosjektdokument...");
  const project = await client.create({
    _type: "project",
    clientName: "Collect",
    title: "En digital tjeneste for trygg hudpleie",
    slug: { _type: "slug", current: "collect" },
    tags,
    headerImage: header,

    ingress:
      "I emnet digitaldesign har vi utviklet Collect – en digital tjeneste som skal hjelpe unge og unge voksne med å ta bedre og tryggere valg i hudpleiehverdagen.\n\nGjennom grundig innsiktsarbeid, strategiutvikling og visuell design har vi utviklet både app og tilhørende markedsføring for å skape trygghet, oversikt og kunnskap.\n\nCollect bidrar til å motvirke bomkjøp, feilvalg og informasjonskaos i hudpleiemarkedet.",

    kundeLabel: "Kunde",
    kunde:      "Collect (fiktiv)",
    samarbeid:  "Semesteroppgave i emnet digitaldesign, i samarbeid med Synne Sandbakk Gurvin og Emma Jansen",
    leveranse:  "Visuell identitet, prototype på app, markedsføringsmateriell",
    periode:    "2024",

    sections: [
      textBlock("Utfordring", [
        ...block("I metodene ble vi kjent med at forbrukere i dag stoler blindt på informasjon fra mennesker på sosiale medier de ikke vet om sitter på korrekt kunnskap, eller får betalt for å uttale seg positivt. Disse unngår å henvende seg til kunnskapsrike butikkansatte for hjelp, siden de allerede har latt seg overbevise før de ankommer butikken."),
        ...block("Vi ser også at samme gruppe føler seg overveldet av informasjon, har vanskelig med å skille ut troverdige kilder, og opplever at de ikke er fornøyd med prestasjonen av deres hudpleieprodukter. Resultatet av dette er et høyt forbruk, bomkjøp og smertefulle hudreaksjoner."),
      ], true),

      // Liten bilde til venstre, stor til høyre → position "hoyre"
      imgMulti("storOgLiten", [solL, solS], "hoyre"),

      textBlock("Løsning", [
        ...block("For å møte disse utfordringene har vi utviklet Collect – en trygg, nøytral og troverdig digital tjeneste. Gjennom en hudpleiequiz får brukeren personlige anbefalinger på produkter, hudpleierutiner og veiledning basert på egen hudtype og utfordringer."),
        boldBlock("Appen tilbyr også:"),
        bulletBlock("Oversikt over egen rutine og produktbruk"),
        bulletBlock("Pushvarsler for UV-nivå og påminnelser om solbeskyttelse"),
        bulletBlock("Artikler og guider som gir kunnskap om alt fra A–Å innen hud og pleie"),
        ...block("Collect fungerer som et enkelt og oversiktlig veiledningsverktøy der brukeren opplever støtte, kunnskap og trygghet. Tjenesten skal oppfattes som troverdig, pålitelig, informativ og positiv – og møte målgruppen med et oppmuntrende og bekreftende språk."),
      ], true),

      imgMulti("toKvadratiske", [pair1a, pair1b]),

      imgMulti("toRektangulare", [rect1a, rect1b]),

      textBlock("Utforming av markedsmateriell", [
        ...block("For å kommunisere Collects verdi og nå målgruppen har vi utviklet målrettet markedsmateriell for ulike kanaler. Materialet er designet for å fremstå troverdig, tilgjengelig og visuelt engasjerende, med fokus på positive og lekne bilder og farger som appellerer til ungdom og unge kvinner."),
        ...block("Logoen presenteres tydelig med god kontrast, slik at mottakeren enkelt kan koble innholdet til applikasjonen. Vi har laget konkrete eksempler som en Instagram Story og en annonse i Elle, der begge fungerer som en del av samme kampanje med mål om å øke kjennskap og skape oppmerksomhet rundt Collect."),
        ...block("Hvert materiell inneholder en tydelig og motiverende CTA som leder brukeren til landingssiden for nedlasting eller til nettsiden for mer informasjon, og bidrar til en helhetlig og sammenhengende merkevareopplevelse."),
      ], true),

      imgSingle(hoved),

      // Stor til venstre, liten til høyre → position "venstre"
      imgMulti("storOgLiten", [storL, storS], "venstre"),
    ],
  });

  console.log(`\n✅ Ferdig! Prosjekt opprettet med ID: ${project._id}`);
  console.log(`👉 Åpne i Studio: http://localhost:3000/studio`);
  console.log(`👉 Se siden på: http://localhost:3000/prosjekter/collect`);
}

main().catch((err) => {
  console.error("❌ Feil:", err.message);
  process.exit(1);
});
