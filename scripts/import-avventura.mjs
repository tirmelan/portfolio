// Kjør med: node scripts/import-avventura.mjs
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
  header:   "https://www.figma.com/api/mcp/asset/e2b81348-6b8a-400d-9673-76626be9091a",
  pair1a:   "https://www.figma.com/api/mcp/asset/f41c5b5a-1806-4dc3-8237-f73dca37e4aa",
  pair1b:   "https://www.figma.com/api/mcp/asset/7e8265b3-4c04-461b-9227-fd2977b685cb",
  kv1:      "https://www.figma.com/api/mcp/asset/78d2ad39-d1a4-467c-9c71-7b98a75b10e3",
  kv2:      "https://www.figma.com/api/mcp/asset/bca59316-f924-4c43-a023-3fab2d7b7e17",
  strip1a:  "https://www.figma.com/api/mcp/asset/69c7e3fb-51f4-42d4-9cfb-e9d8352c2a44",
  strip1b:  "https://www.figma.com/api/mcp/asset/549d3c1c-4d7e-4ace-a86d-c4a24880f430",
  strip1c:  "https://www.figma.com/api/mcp/asset/488425dc-6233-4839-b784-cba690219097",
  strip1d:  "https://www.figma.com/api/mcp/asset/e29902f0-476d-4637-8a9b-03fd7401b76e",
  pair2a:   "https://www.figma.com/api/mcp/asset/4f997fa5-33aa-4c66-814c-db95d56d8e45",
  pair2b:   "https://www.figma.com/api/mcp/asset/4717475b-5a4b-4b16-842a-7209c8bfdeed",
  vk1:      "https://www.figma.com/api/mcp/asset/c04f2779-b733-4abc-a6ad-c30704603d39",
  vk2:      "https://www.figma.com/api/mcp/asset/4d6049cd-9799-4ae1-921e-243f1b154970",
  vk3:      "https://www.figma.com/api/mcp/asset/3bd0d93d-a42d-4f29-8f80-b8b6feb038f8",
  vk4:      "https://www.figma.com/api/mcp/asset/1dd8f1e3-970e-44e1-b3ee-125c5eebff5b",
  farge:    "https://www.figma.com/api/mcp/asset/651c1e6d-7b50-4877-ba4d-4eedd5a6451e",
  strip2a:  "https://www.figma.com/api/mcp/asset/15835e47-fd5e-4798-b391-628ca1cef3a8",
  strip2b:  "https://www.figma.com/api/mcp/asset/774a0a26-b7d3-40f3-8ebf-b848813958d2",
  strip2c:  "https://www.figma.com/api/mcp/asset/f3da42d4-7fca-4862-babc-b5674067c74e",
  strip2d:  "https://www.figma.com/api/mcp/asset/5b3a7690-1960-47c6-a89d-b3d9cd100969",
  hero2:    "https://www.figma.com/api/mcp/asset/c853b301-651a-4028-bc50-199019957377",
  grid1:    "https://www.figma.com/api/mcp/asset/ed808604-0585-438c-9019-5c58652d5089",
  grid2:    "https://www.figma.com/api/mcp/asset/6858a3c4-dbf5-4dca-b1a4-cc15b6e9f84f",
  grid3:    "https://www.figma.com/api/mcp/asset/db60756e-5f4e-4833-b51f-21507ac403ad",
  grid4:    "https://www.figma.com/api/mcp/asset/0a322506-b619-4791-af4c-a22127210f66",
  grid5:    "https://www.figma.com/api/mcp/asset/b45e3263-d863-4de9-b708-7012b7268845",
  grid6:    "https://www.figma.com/api/mcp/asset/7bc5e0e6-0071-4c13-9acf-61df99401bbb",
  grid7:    "https://www.figma.com/api/mcp/asset/c7bf8f31-c994-4915-8f13-18a1bf6cabeb",
  grid8:    "https://www.figma.com/api/mcp/asset/16241994-8030-49bc-ad79-cd01ee5a00b5",
  grid9:    "https://www.figma.com/api/mcp/asset/8a4d93b4-30da-4133-9406-fcbb0735a31f",
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

function bulletBlock(boldText, rest) {
  return {
    _type: "block",
    _key: randomUUID(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      { _type: "span", _key: randomUUID(), text: boldText, marks: ["strong"] },
      { _type: "span", _key: randomUUID(), text: rest, marks: [] },
    ],
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
  console.log("🚀 Starter import av Avventura...\n");

  // 1. Tags
  console.log("Oppretter tags...");
  const tags = await Promise.all([
    findOrCreateTag("Strategi", "rosa"),
    findOrCreateTag("Logo", "mellombla"),
    findOrCreateTag("Visuell identitet", "gul"),
    findOrCreateTag("Emballasjedesign", "mellombla"),
  ]);

  // 2. Bilder (sekvensielt for å unngå SSL-feil)
  console.log("\nLaster opp bilder...");
  const header  = await uploadImage(IMGS.header,  "avventura-header.jpg");
  const pair1a  = await uploadImage(IMGS.pair1a,  "avventura-par1a.jpg");
  const pair1b  = await uploadImage(IMGS.pair1b,  "avventura-par1b.jpg");
  const kv1     = await uploadImage(IMGS.kv1,     "avventura-kv1.jpg");
  const kv2     = await uploadImage(IMGS.kv2,     "avventura-kv2.jpg");
  const strip1a = await uploadImage(IMGS.strip1a, "avventura-stripe1a.jpg");
  const strip1b = await uploadImage(IMGS.strip1b, "avventura-stripe1b.jpg");
  const strip1c = await uploadImage(IMGS.strip1c, "avventura-stripe1c.jpg");
  const strip1d = await uploadImage(IMGS.strip1d, "avventura-stripe1d.jpg");
  const pair2a  = await uploadImage(IMGS.pair2a,  "avventura-par2a.jpg");
  const pair2b  = await uploadImage(IMGS.pair2b,  "avventura-par2b.jpg");
  const vk1     = await uploadImage(IMGS.vk1,     "avventura-visittkort1.jpg");
  const vk2     = await uploadImage(IMGS.vk2,     "avventura-visittkort2.jpg");
  const vk3     = await uploadImage(IMGS.vk3,     "avventura-visittkort3.jpg");
  const vk4     = await uploadImage(IMGS.vk4,     "avventura-visittkort4.jpg");
  const farge   = await uploadImage(IMGS.farge,   "avventura-farge.jpg");
  const strip2a = await uploadImage(IMGS.strip2a, "avventura-stripe2a.jpg");
  const strip2b = await uploadImage(IMGS.strip2b, "avventura-stripe2b.jpg");
  const strip2c = await uploadImage(IMGS.strip2c, "avventura-stripe2c.jpg");
  const strip2d = await uploadImage(IMGS.strip2d, "avventura-stripe2d.jpg");
  const hero2   = await uploadImage(IMGS.hero2,   "avventura-hero2.jpg");
  const grid1   = await uploadImage(IMGS.grid1,   "avventura-grid1.jpg");
  const grid2   = await uploadImage(IMGS.grid2,   "avventura-grid2.jpg");
  const grid3   = await uploadImage(IMGS.grid3,   "avventura-grid3.jpg");
  const grid4   = await uploadImage(IMGS.grid4,   "avventura-grid4.jpg");
  const grid5   = await uploadImage(IMGS.grid5,   "avventura-grid5.jpg");
  const grid6   = await uploadImage(IMGS.grid6,   "avventura-grid6.jpg");
  const grid7   = await uploadImage(IMGS.grid7,   "avventura-grid7.jpg");
  const grid8   = await uploadImage(IMGS.grid8,   "avventura-grid8.jpg");
  const grid9   = await uploadImage(IMGS.grid9,   "avventura-grid9.jpg");

  // 3. Opprett prosjektet
  console.log("\nOppretter prosjektdokument...");
  const project = await client.create({
    _type: "project",
    clientName: "Avventura",
    title: "En eksentrisk identitet for italiensk fusion",
    slug: { _type: "slug", current: "avventura" },
    tags,
    headerImage: header,

    ingress:
      "Som en del av emnet «Portfolio og bransjekunnskap», var oppgaven å gjennomføre et selvvalgt prosjekt med full kreativ frihet. Min oppgave var derfor ikke bare å designe, men å utvikle et komplett konsept fra bunnen av, basert på historiefortelling og personlig inspirasjon.\n\nResultatet ble «Avventura» – et konsept for en italiensk fusion-brunch, inspirert av egne erfaringer med mat, reise og kulturutveksling. Målet var å bygge en helhetlig visuell identitet som forteller en historie, forankret i verdiene unik, kreativ og kvalitet.",

    kundeLabel: "Emne",
    kunde:      "Portfolio og bransjekunnskap",
    samarbeid:  "Oppgave gjennom Universitetet i sør-øst Norge",
    leveranse:  "Konseptutvikling, visuell identitet og logo",
    periode:    "2024",

    sections: [
      imgMulti("toKvadratiske", [pair1a, pair1b]),

      textBlock("Utfordring", [
        ...block("Dette prosjektet springer ut fra en personlig erfaring: opplevelsen av hvordan strenge tradisjoner noen ganger kan kvele kreativitet. Utfordringen ble derfor å snu denne opplevelsen til noe positivt og kreativt."),
        bulletBlock("Fra erfaring til konsept", ": Hvordan kunne jeg omsette en personlig refleksjon rundt mat og kultur til et helhetlig og engasjerende restaurantkonsept? Målet var å skape et merke som feiret kreativitet og fusjon."),
        bulletBlock("Fortelle en historie visuelt", ": Konseptet er bygget på en historie om reise og oppdagelse. Den store designutfordringen var å oversette denne abstrakte fortellingen til et konkret og gjenkjennelig visuelt språk som fungerte på alt fra menyer til sosiale medier."),
        bulletBlock("Finne den visuelle balansen", ": Hvordan skaper man et uttrykk for «italiensk fusion»? Identiteten måtte balansere det klassiske og elegante man forbinder med Italia, med en leken og uventet stil som reflekterte de globale smakene."),
      ], true),

      imgMulti("toRektangulare", [kv1, kv2]),

      imgMulti("fireIRekke", [strip1a, strip1b, strip1c, strip1d]),

      textBlock("Løsning", [
        ...block("Løsningen ble en visuell identitet bygget rundt en sterk kjernefortelling, der hvert designelement er en del av en større historie. Alt startet med historien om en fiktiv, italiensk kokk med stor reiselyst, som samler smaker og inspirasjon fra hele verden – nesten som suvenirer."),
        ...block("Navnet «Avventura» – italiensk for eventyr – ble det naturlige ankeret for konseptet. Denne fortellingen ble den strategiske rettesnoren for designet: Alt ved Avventura skulle føles som en oppdagelsesreise."),
      ], true),

      textBlock("Balansen mellom tradisjon og eventyr", [
        ...block("Identiteten balanserer det klassiske med det uventede. Primærlogoen, med sin elegante skriveskrift, gir en følelse av personlig håndverk og italiensk tradisjon. Dette står i kontrast til den sterke og moderne serif-fonten som brukes i titler og sekundærlogoer. Sammen skaper de et uttrykk som er både sofistikert og lekent."),
      ], false),

      imgMulti("toKvadratiske", [pair2a, pair2b]),

      imgMulti("fireIRekke", [vk1, vk2, vk3, vk4]),

      textBlock("Uventet, friskt og sofistikert", [
        ...block("Jeg droppet bevisst de klassiske «Italia-fargene» for å skape noe unikt. Fargepaletten kombinerer en dyp, mørk marineblå med en myk pastellrosa. Det mørkeblå gir en følelse av kvalitet og profesjonalitet, mens det rosa tilfører varme, friskhet og et hint av det uventede – akkurat som fusion-maten."),
      ], false),

      imgSingle(farge),

      textBlock("Det femte element: Reisens suvenirer", [
        ...block("Kjernen i historiefortellingen er de grafiske elementene. Inspirert av reisesuvenirer som frimerker, billetter, bagasjelapper og stempler, fungerer disse som identitetens visuelle lim. De brukes som rammer, symboler og dekorative elementer på alt fra menyer til plakater."),
        ...block("Slik blir hvert møte med Avventura en påminnelse om historien bak – at dette er mer enn bare en restaurant; det er en reise."),
      ], false),

      imgMulti("fireIRekke", [strip2a, strip2b, strip2c, strip2d]),

      textBlock("Kreative produkter som forteller historien", [
        ...block("For å gjøre konseptet levende, utviklet jeg produkter som gjør gjestene til en del av eventyret. Menyen ble designet som et «Taste Map» – et smaks-kart som inviterer gjestene til å utforske rettene som om de var destinasjoner på en reise. For å bestille, fyller gjestene ut et postkort med sine ønsker, som de så «sender» til kjøkkenet."),
        ...block("Disse interaktive elementene forsterker merkefortellingen og gjør restaurantbesøket til et minneverdig eventyr."),
      ], false),

      imgSingle(hero2),

      imgMulti("treGangerTre", [grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8, grid9]),
    ],
  });

  console.log(`\n✅ Ferdig! Prosjekt opprettet med ID: ${project._id}`);
  console.log(`👉 Åpne i Studio: http://localhost:3000/studio`);
  console.log(`👉 Se siden på: http://localhost:3000/prosjekter/avventura`);
}

main().catch((err) => {
  console.error("❌ Feil:", err.message);
  process.exit(1);
});
