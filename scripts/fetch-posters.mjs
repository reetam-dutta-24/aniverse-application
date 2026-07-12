/**
 * One-shot dev script: downloads dummy poster/cover art into
 * public/images/posters for the mock data layer. Anime posters come from
 * the Jikan API (MyAnimeList), song covers from the iTunes Search API.
 *
 * Usage: node scripts/fetch-posters.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "images", "posters");

const anime = [
  ["jujutsu-kaisen", "Jujutsu Kaisen"],
  ["demon-slayer", "Kimetsu no Yaiba"],
  ["attack-on-titan", "Shingeki no Kyojin"],
  ["classroom-of-the-elite", "Classroom of the Elite"],
  ["death-note", "Death Note"],
  ["code-geass", "Code Geass"],
  ["monster", "Monster"],
  ["chainsaw-man", "Chainsaw Man"],
  ["frieren", "Sousou no Frieren"],
  ["spy-x-family", "Spy x Family"],
  ["oshi-no-ko", "Oshi no Ko"],
  ["haikyu", "Haikyuu!!"],
  ["your-name", "Kimi no Na wa."],
  ["vinland-saga", "Vinland Saga"],
  ["blue-lock", "Blue Lock"],
  ["suzume", "Suzume no Tojimari"],
  ["naruto-shippuden", "Naruto Shippuden"],
  ["tokyo-ghoul", "Tokyo Ghoul"],
];

const songs = [
  ["night-dancer", "night dancer imase"],
  ["ghost", "ghost justin bieber"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(url, slug) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(outDir, `${slug}.jpg`), buffer);
}

await mkdir(outDir, { recursive: true });

for (const [slug, query] of anime) {
  if (existsSync(path.join(outDir, `${slug}.jpg`))) {
    console.log(`skip  ${slug} (exists)`);
    continue;
  }
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query:
          "query($search:String){Media(search:$search,type:ANIME){coverImage{extraLarge large}}}",
        variables: { search: query },
      }),
    });
    const json = await res.json();
    const cover = json?.data?.Media?.coverImage;
    const url = cover?.extraLarge ?? cover?.large;
    if (!url) throw new Error(json?.errors?.[0]?.message ?? "no result");
    await download(url, slug);
    console.log(`ok    ${slug}`);
  } catch (err) {
    console.error(`fail  ${slug}: ${err.message}`);
  }
  // Stay well under AniList's rate limit
  await sleep(800);
}

for (const [slug, term] of songs) {
  if (existsSync(path.join(outDir, `${slug}.jpg`))) {
    console.log(`skip  ${slug} (exists)`);
    continue;
  }
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`,
    );
    const json = await res.json();
    const art = json?.results?.[0]?.artworkUrl100;
    if (!art) throw new Error("no result");
    await download(art.replace("100x100", "600x600"), slug);
    console.log(`ok    ${slug}`);
  } catch (err) {
    console.error(`fail  ${slug}: ${err.message}`);
  }
  await sleep(500);
}

console.log("done");
