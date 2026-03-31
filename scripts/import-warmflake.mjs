// Kjør med: node scripts/import-warmflake.mjs
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
  header:  "https://www.figma.com/api/mcp/asset/38ca6c85-930d-439f-84e2-bed944be32ff",
  pair1a:  "https://www.figma.com/api/mcp/asset/cff5b375-3681-44f0-9349-aae8f6a19792",
  pair1b:  "https://www.figma.com/api/mcp/asset/0e5f9392-6ed0-4f96-971f-d0d0b6c44980",
  sol_l:   "https://www.figma.com/api/mcp/asset/61021f36-18bf-4db2-8467-d0d510b986d4",
  sol_tr:  "https://www.figma.com/api/mcp/asset/f8858c2b-5985-4acb-8f78-7ddd0c7bc990",
  sol_br:  "https://www.figma.com/api/mcp/asset/682736e1-07dd-46f8-ab85-3899bd0a5f0b",
  logo1:   "https://www.figma.com/api/mcp/asset/2381e127-f4eb-4c72-a497-405518a4bdea",
  logo2:   "https://www.figma.com/api/mcp/asset/c955cc05-a746-4f3c-8438-98aca0175794",
  farge1:  "https://www.figma.com/api/mcp/asset/32c1418b-e75f-4758-ba01-bafac006930d",
  farge2:  "https://www.figma.com/api/mcp/asset/4705b511-3f25-46b1-9a69-da9c1c35bef5",
  farge3:  "https://www.figma.com/api/mcp/asset/6861c3fe-a7b7-4cfd-9ed2-5d2080dc430a",
  farge4:  "https://www.figma.com/api/mcp/asset/878f32d1-4c54-4c01-959d-374e0d6ba2e0",
  slut1:   "https://www.figma.com/api/mcp/asset/27f808d6-65e3-43de-a7bc-46dc2001020a",
  slut2:   "https://www.figma.com/api/mcp/asset/a00a180d-1c7b-4675-aff2-889301e912f2",
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

function textBlock(title, body) {
  return { _type: "textBlock", _key: randomUUID(), title, body };
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
  console.log("🚀 Starter import av Warmflake...\n");

  // 1. Tags
  console.log("Oppretter tags...");
  const tags = await Promise.all([
    findOrCreateTag("Visuell identitet", "gul"),
    findOrCreateTag("Strategi", "rosa"),
    findOrCreateTag("Logo", "mellombla"),
  ]);

  // 2. Bilder (sekvensielt for å unngå SSL-feil)
  console.log("\nLaster opp bilder...");
  const headerImg = await uploadImage(IMGS.header, "warmflake-header.jpg");
  const p1a       = await uploadImage(IMGS.pair1a, "warmflake-intro-1.jpg");
  const p1b       = await uploadImage(IMGS.pair1b, "warmflake-intro-2.jpg");
  const solL      = await uploadImage(IMGS.sol_l,  "warmflake-sol-stor.jpg");
  const solTr     = await uploadImage(IMGS.sol_tr, "warmflake-sol-topp.jpg");
  const solBr     = await uploadImage(IMGS.sol_br, "warmflake-sol-bunn.jpg");
  const logo1     = await uploadImage(IMGS.logo1,  "warmflake-logo-1.jpg");
  const logo2     = await uploadImage(IMGS.logo2,  "warmflake-logo-2.jpg");
  const farge1    = await uploadImage(IMGS.farge1, "warmflake-farge-1.jpg");
  const farge2    = await uploadImage(IMGS.farge2, "warmflake-farge-2.jpg");
  const farge3    = await uploadImage(IMGS.farge3, "warmflake-farge-3.jpg");
  const farge4    = await uploadImage(IMGS.farge4, "warmflake-farge-4.jpg");
  const slut1     = await uploadImage(IMGS.slut1,  "warmflake-avslutning-1.jpg");
  const slut2     = await uploadImage(IMGS.slut2,  "warmflake-avslutning-2.jpg");

  // 3. Opprett prosjektet
  console.log("\nOppretter prosjektdokument...");
  const project = await client.create({
    _type: "project",
    clientName: "Warmflake",
    title: "Fra nyetablert til synlig markedsleder",
    slug: { _type: "slug", current: "warmflake" },
    tags,
    headerImage: headerImg,

    ingress:
      "Warmflake er en nyoppstartet bedrift med en kritisk viktig misjon: å utvikle produkter som forhindrer hypotermi hos skadde mennesker i felt. Som en ny aktør i et marked der tillit og troverdighet er altavgjørende, manglet de en profesjonell og enhetlig visuell identitet for å kunne etablere seg mot målgrupper som Forsvaret, NATO og sivile redningstjenester.\n\nVår oppgave var å bygge merkevaren Warmflake fra grunnen av – å gi dem en stemme og et ansikt som kommuniserer trygghet, innovasjon og norsk kvalitet.",

    kundeLabel: "Kunde",
    kunde:      "Warmflake",
    samarbeid:  "Bacheloroppgave utarbeidet sammen med Brage Strømmen Karoline Thorstensen og Helene Vindheim ved USN",
    leveranse:  "Visuell identitet, logo og kommunikasjonsstrategi",
    periode:    "2024",

    sections: [
      imgMulti("toKvadratiske", [p1a, p1b]),

      textBlock("Utfordringer", [
        ...block("Hvordan lanserer man en helt ny merkevare i et marked med etablerte konkurrenter og skyhøye krav til kvalitet og pålitelighet? Warmflake stod overfor flere sentrale utfordringer:"),
        bulletBlock("Manglende posisjon", ": De var ukjente og trengte å bygge kjennskap og troverdighet raskt."),
        bulletBlock("Fravær av identitet", ": Uten en gjennomarbeidet visuell profil var det vanskelig å fremstå profesjonelt og gjenkjennelig."),
        bulletBlock("Strategisk usikkerhet", ": De trengte en klar kommunikasjonsstrategi for å nå ut til både det militære og det sivile markedet på en effektiv måte."),
        bulletBlock("Kompleks målgruppe", ": Kommunikasjonen måtte treffe alt fra innkjøpere i Forsvaret til potensielle investorer og sluttbrukere i felt."),
        ...block("Kjernen i utfordringen var å oversette selskapets kjernevirksomhet – å redde liv ved å holde folk varme – til et visuelt språk som umiddelbart skapte tillit."),
      ]),

      textBlockLiten(
        "Kjernen i løsningen",
        "Gjennom workshops med kunden, konkurrentanalyser, SWOT og posisjoneringskart avdekket vi et avgjørende funn: For å lykkes måtte Warmflake balansere to verdener. På den ene siden den robuste, tekniske presisjonen som kreves av militært utstyr, og på den andre siden den empatiske, menneskelige omsorgen som ligger i å redde liv.",
        "Denne dualiteten – balansen mellom det tekniske og det humane – ble den strategiske kjernen og rettesnoren for hele den visuelle identiteten.",
      ),

      imgMulti("storOgLiten", [solL, solTr, solBr], "venstre"),

      textBlockLiten(
        "En unik og meningsbærende logo",
        "Kjernen i den nye identiteten er en unik logo som forestiller en snøkrystall. Symbolet representerer både utfordringen – kulden – og løsningen – omsorg og beskyttelse. Formen er bygget opp av presise, geometriske linjer som uttrykker robusthet og struktur, mens de avrundede hjørnene på innsiden gir et varmere og mer empatisk preg.",
        "De samme linjene er hentet ut og videreført som grafiske elementer i identitetens femte element, noe som skaper en tydelig visuell sammenheng og helhet.",
        "Dette gjør logoen både teknisk og menneskelig – akkurat som Warmflake.",
      ),

      imgMulti("toKvadratiske", [logo1, logo2]),

      textBlockLiten(
        "Farger og typografi med en klar forankring",
        "Fargepaletten er direkte inspirert av det norske flagget og naturen, for å bygge på verdier som kvalitet, trygghet og nasjonal ekspertise. En dyp marineblå farge representerer det stabile og troverdige, mens en kraftig, varm rød farge kommuniserer energi, handlekraft og selve kjernefunksjonen: varme.",
        "Sammen med en moderne og svært lesbar grotesk skrifttype, skaper dette et profesjonelt og autoritært, men samtidig tilgjengelig uttrykk.",
      ),

      imgMulti("toKvadratiske", [farge1, farge2]),
      imgMulti("toKvadratiske", [farge3, farge4]),

      textBlockLiten(
        "En komplett verktøykasse",
        "En god identitet må leve og fungere i hverdagen. Derfor leverte vi en komplett verktøykasse som gjør det enkelt for Warmflake å være konsistente og profesjonelle. Dette inkluderte en grundig designmanual, brukervennlige maler, et sett med grafiske elementer og en tydelig bildestil.",
      ),

      imgMulti("toKvadratiske", [slut1, slut2]),
    ],
  });

  console.log(`\n✅ Ferdig! Prosjekt opprettet med ID: ${project._id}`);
  console.log(`👉 Åpne i Studio: http://localhost:3000/studio`);
}

main().catch((err) => {
  console.error("❌ Feil:", err.message);
  process.exit(1);
});
