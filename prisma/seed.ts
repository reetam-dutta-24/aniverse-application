import bcrypt from "bcryptjs";
import { PrismaClient, PlatformRole } from "@prisma/client";
import { ARTIST_ITEMS } from "../lib/seed/artists";
import { CONTENT_ITEMS } from "../lib/seed/content-items";
import { CONTENT_NESTED } from "../lib/seed/content-nested";
import {
  generateMovieNested,
  generateSeriesNested,
  isMovieType,
  normalizeContentGenre,
  poster,
  type CatalogReviewSeed,
  type ContentNestedSeed,
  type ContentSeedBase,
} from "../lib/seed/helpers";
import { MUSIC_ITEMS } from "../lib/seed/music";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

const MEDIA_MAP = {
  anime: "ANIME",
  show: "SHOW",
  movie: "MOVIE",
  documentary: "DOCUMENTARY",
  kdrama: "KDRAMA",
} as const;

const PLATFORM_ADMINS = [
  { email: "admin@aniverse.local", password: "Admin123!", name: "AniVerse Super Admin", handle: "aniverse_admin", role: PlatformRole.SUPER_ADMIN },
  { email: "content@aniverse.local", password: "Content123!", name: "Content Admin", handle: "content_admin", role: PlatformRole.CONTENT_ADMIN },
  { email: "music@aniverse.local", password: "Music123!", name: "Music Admin", handle: "music_admin", role: PlatformRole.MUSIC_ADMIN },
  { email: "artist@aniverse.local", password: "Artist123!", name: "Artist Admin", handle: "artist_admin", role: PlatformRole.ARTIST_ADMIN },
] as const;

async function seedAdminUsers() {
  for (const account of PLATFORM_ADMINS) {
    const email = account.email.toLowerCase();
    const passwordHash = await bcrypt.hash(account.password, BCRYPT_ROUNDS);
    const admin = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        handle: account.handle,
        name: account.name,
        passwordHash,
        role: account.role,
        onboardingCompletedAt: new Date(),
        aiTasteScore: 100,
        preferences: { create: {} },
      },
      update: { role: account.role, name: account.name, passwordHash, handle: account.handle },
      select: { email: true, handle: true, role: true },
    });
    console.log(`Admin ready: ${admin.email} (@${admin.handle}) [${admin.role}]`);
  }
  console.log("\nAdmin credentials:");
  for (const account of PLATFORM_ADMINS) {
    console.log(`  ${account.role}: ${account.email} / ${account.password}`);
  }
}

async function upsertGenres(slugs: string[]) {
  const unique = [...new Set(slugs.map(normalizeContentGenre))];
  return Promise.all(
    unique.map((slug) =>
      prisma.genre.upsert({
        where: { label: slug },
        create: { label: slug },
        update: {},
      }),
    ),
  );
}

function resolveNested(item: ContentSeedBase): ContentNestedSeed {
  const custom = CONTENT_NESTED[item.slug];
  if (custom) return custom;

  if (isMovieType(item.type)) {
    return generateMovieNested(item.slug, item.title, item.episodeDuration ?? "Full Movie");
  }

  const seasonCount = item.seasonCount ?? 1;
  const episodeCount = item.episodeCount ?? 12;
  const episodesPerSeason = Math.max(3, Math.min(12, Math.ceil(episodeCount / seasonCount)));

  return {
    ...generateSeriesNested(item.slug, { seasonCount, episodesPerSeason }),
    characters: [
      { name: `${item.title} Lead`, role: "Main", accent: item.accent ?? "blue" },
      { name: `${item.title} Rival`, role: "Supporting", accent: "purple" },
    ],
    relatedSlugs: CONTENT_ITEMS.filter((c) => c.slug !== item.slug)
      .slice(0, 4)
      .map((c) => c.slug),
    catalogReviews: [
      {
        authorName: "AniVerse Curator",
        authorAvatarColor: "#ff00cc",
        rating: item.rating ?? 8,
        body: `${item.title} is a standout pick on AniVerse — add it to your watchlist today.`,
        accent: item.accent,
        likeCount: 12,
      },
    ],
  };
}

async function syncCatalogReviews(
  reviews: CatalogReviewSeed[],
  link: { contentId?: string; trackId?: string; artistId?: string },
) {
  const where = link.contentId
    ? { contentId: link.contentId }
    : link.trackId
      ? { trackId: link.trackId }
      : { artistId: link.artistId! };

  await prisma.catalogReview.deleteMany({ where });
  for (const [index, review] of reviews.entries()) {
    await prisma.catalogReview.create({
      data: {
        ...link,
        authorName: review.authorName,
        authorAvatarColor: review.authorAvatarColor ?? "#ff00cc",
        rating: review.rating,
        headline: review.headline ?? null,
        body: review.body,
        accent: review.accent ?? null,
        likeCount: review.likeCount ?? 0,
        position: index,
      },
    });
  }
}

async function syncContentNested(contentId: string, slug: string, nested: ContentNestedSeed) {
  await prisma.$transaction([
    prisma.contentEpisode.deleteMany({ where: { contentId } }),
    prisma.contentSeason.deleteMany({ where: { contentId } }),
    prisma.contentCharacter.deleteMany({ where: { contentId } }),
    prisma.contentFeaturedTrack.deleteMany({ where: { contentId } }),
    prisma.contentRelated.deleteMany({ where: { contentId } }),
    prisma.catalogReview.deleteMany({ where: { contentId } }),
  ]);

  const seasonIdByNumber = new Map<number, string>();

  for (const [index, season] of (nested.seasons ?? []).entries()) {
    const row = await prisma.contentSeason.create({
      data: {
        contentId,
        label: season.label,
        episodeCount: season.episodeCount,
        position: index,
      },
    });
    const num = index + 1;
    seasonIdByNumber.set(num, row.id);
  }

  for (const [index, ep] of (nested.episodes ?? []).entries()) {
    await prisma.contentEpisode.create({
      data: {
        contentId,
        seasonId: seasonIdByNumber.get(ep.seasonNumber) ?? null,
        seasonNumber: ep.seasonNumber,
        number: ep.number,
        title: ep.title,
        duration: ep.duration ?? null,
        description: ep.description ?? null,
        thumbnailUrl: ep.thumbnailUrl ?? poster(slug),
        language: ep.language ?? null,
        rating: ep.rating ?? null,
        position: index,
      },
    });
  }

  for (const [index, character] of (nested.characters ?? []).entries()) {
    await prisma.contentCharacter.create({
      data: {
        contentId,
        name: character.name,
        role: character.role ?? null,
        voiceActor: character.voiceActor ?? null,
        imageUrl: character.imageUrl ?? poster(slug),
        accent: character.accent ?? null,
        position: index,
      },
    });
  }

  if (nested.catalogReviews?.length) {
    await syncCatalogReviews(nested.catalogReviews, { contentId });
  }
}

async function linkContentRelations(
  contentId: string,
  slug: string,
  nested: ContentNestedSeed,
  slugToId: Map<string, string>,
  trackSlugToId: Map<string, string>,
) {
  for (const [index, relatedSlug] of (nested.relatedSlugs ?? []).entries()) {
    const relatedId = slugToId.get(relatedSlug);
    if (!relatedId || relatedId === contentId) continue;
    await prisma.contentRelated.upsert({
      where: { contentId_relatedId: { contentId, relatedId } },
      create: { contentId, relatedId, position: index },
      update: { position: index },
    });
  }

  for (const [index, trackSlug] of (nested.featuredTrackSlugs ?? []).entries()) {
    const trackId = trackSlugToId.get(trackSlug);
    if (!trackId) continue;
    await prisma.contentFeaturedTrack.upsert({
      where: { contentId_trackId: { contentId, trackId } },
      create: { contentId, trackId, position: index },
      update: { position: index },
    });
  }
}

async function seedContent() {
  let created = 0;
  let updated = 0;
  const slugToId = new Map<string, string>();

  for (const item of CONTENT_ITEMS) {
    const genreRows = await upsertGenres(item.genreLabels);
    const nested = resolveNested(item);
    const isMovie = isMovieType(item.type);

    const data = {
      title: item.title,
      nativeTitle: item.nativeTitle ?? null,
      type: MEDIA_MAP[item.type],
      description: item.description ?? null,
      synopsis: item.synopsis ?? item.description ?? null,
      imageUrl: item.imageUrl ?? poster(item.slug),
      backdropUrl: item.backdropUrl ?? item.imageUrl ?? poster(item.slug),
      rating: item.rating ?? null,
      year: item.year ?? null,
      meta: item.meta ?? null,
      accent: item.accent ?? null,
      trendingLabel: item.trendingLabel ?? `Trending on AniVerse · ${item.type.toUpperCase()}`,
      creditLabel: item.creditLabel ?? null,
      highlightTags: item.highlightTags ?? [],
      studio: item.studio ?? null,
      director: item.director ?? null,
      originalAuthor: item.originalAuthor ?? null,
      sourceMaterial: item.sourceMaterial ?? null,
      status: item.status ?? null,
      ageRating: item.ageRating ?? null,
      imdbRating: item.imdbRating ?? null,
      malScore: item.malScore ?? null,
      airedFrom: item.airedFrom ?? null,
      airedTo: item.airedTo ?? null,
      episodeDuration: item.episodeDuration ?? (isMovie ? "Full Movie" : "24 Min"),
      languages: item.languages ?? ["japanese"],
      seasonCount: isMovie ? null : (item.seasonCount ?? nested.seasons?.length ?? null),
      episodeCount: isMovie ? null : (item.episodeCount ?? nested.episodes?.length ?? null),
      seasonLabel: isMovie ? null : (item.seasonLabel ?? nested.seasons?.[0]?.label ?? null),
    };

    const existing = await prisma.content.findUnique({ where: { slug: item.slug }, select: { id: true } });

    const content = existing
      ? await prisma.content.update({ where: { id: existing.id }, data })
      : await prisma.content.create({ data: { slug: item.slug, ...data } });

    slugToId.set(item.slug, content.id);

    await prisma.contentGenre.deleteMany({ where: { contentId: content.id } });
    await prisma.contentGenre.createMany({
      data: genreRows.map((genre) => ({ contentId: content.id, genreId: genre.id })),
      skipDuplicates: true,
    });

    await syncContentNested(content.id, item.slug, nested);

    if (existing) updated += 1;
    else created += 1;
  }

  console.log(`Content seed: ${created} created, ${updated} updated (${CONTENT_ITEMS.length} total).`);
  return slugToId;
}

async function seedArtists() {
  let count = 0;
  const slugToId = new Map<string, string>();

  for (const item of ARTIST_ITEMS) {
    const existing = await prisma.artist.findUnique({ where: { slug: item.slug }, select: { id: true } });

    const data = {
      title: item.title,
      nativeTitle: item.nativeTitle ?? null,
      synopsis: item.synopsis ?? null,
      imageUrl: item.imageUrl ?? poster(item.slug),
      accent: item.accent ?? null,
      rating: item.rating ?? null,
      rankLeft: item.rankLeft ?? null,
      rankRight: item.rankRight ?? null,
      primaryTags: item.primaryTags ?? [],
      languages: item.languages,
      genres: item.genreLabels,
      label: item.label ?? null,
      debutYear: item.debutYear ?? null,
      isGroup: item.isGroup ?? false,
    } as Parameters<typeof prisma.artist.upsert>[0]["create"];

    const artist = await prisma.artist.upsert({
      where: { slug: item.slug },
      create: { slug: item.slug, ...data },
      update: data,
    });

    slugToId.set(item.slug, artist.id);
    count += 1;

    await prisma.artistMember.deleteMany({ where: { artistId: artist.id } });
    if (item.isGroup && item.members?.length) {
      for (const [index, member] of item.members.entries()) {
        await prisma.artistMember.create({
          data: { artistId: artist.id, name: member.name, role: member.role ?? null, position: index },
        });
      }
    }

    await prisma.catalogReview.deleteMany({ where: { artistId: artist.id } });
    if (item.catalogReviews?.length) {
      await syncCatalogReviews(item.catalogReviews, { artistId: artist.id });
    }
  }

  console.log(`Artist seed: ${count} artists upserted.`);
  return slugToId;
}

async function seedMusic(
  artistSlugToId: Map<string, string>,
  contentSlugToId: Map<string, string>,
) {
  let count = 0;
  const trackSlugToId = new Map<string, string>();

  for (const item of MUSIC_ITEMS) {
    const artistId = item.artistSlug ? artistSlugToId.get(item.artistSlug) ?? null : null;
    const contentId = item.contentSlug ? contentSlugToId.get(item.contentSlug) ?? null : null;

    const data = {
      title: item.title,
      nativeTitle: item.nativeTitle ?? null,
      artist: item.artist,
      kind: item.kind,
      description: item.description ?? null,
      source: item.source ?? null,
      album: item.album ?? null,
      language: item.language ?? null,
      genres: item.genreLabels,
      rating: item.rating ?? null,
      year: item.year ?? null,
      durationLabel: item.durationLabel ?? null,
      durationSeconds: item.durationSeconds ?? null,
      imageUrl: item.imageUrl ?? poster(item.slug),
      backdropUrl: item.imageUrl ?? poster(item.slug),
      accent: item.accent ?? null,
      trendingLabel: item.trendingLabel ?? `Trending on AniVerse · ${item.kind.toUpperCase()}`,
      creditLabel: item.creditLabel ?? `By ${item.artist}`,
      featuredRank: item.featuredRank ?? null,
      artistId,
      contentId,
    } as Parameters<typeof prisma.musicTrack.upsert>[0]["create"];

    const track = await prisma.musicTrack.upsert({
      where: { slug: item.slug },
      create: { slug: item.slug, ...data },
      update: data,
    });

    trackSlugToId.set(item.slug, track.id);
    count += 1;

    await prisma.catalogReview.deleteMany({ where: { trackId: track.id } });
    if (item.catalogReviews?.length) {
      await syncCatalogReviews(item.catalogReviews, { trackId: track.id });
    }
  }

  console.log(`Music seed: ${count} tracks upserted.`);
  return trackSlugToId;
}

async function linkAllContentRelations(
  contentSlugToId: Map<string, string>,
  trackSlugToId: Map<string, string>,
) {
  for (const item of CONTENT_ITEMS) {
    const contentId = contentSlugToId.get(item.slug);
    if (!contentId) continue;
    const nested = resolveNested(item);
    await linkContentRelations(contentId, item.slug, nested, contentSlugToId, trackSlugToId);
  }
  console.log("Content relations linked (related titles + featured OSTs).");
}

async function main() {
  console.log("Seeding AniVerse catalog…\n");
  await seedAdminUsers();
  console.log("");
  const contentSlugToId = await seedContent();
  const artistSlugToId = await seedArtists();
  const trackSlugToId = await seedMusic(artistSlugToId, contentSlugToId);
  await linkAllContentRelations(contentSlugToId, trackSlugToId);
  console.log("\nSeed complete.");
  console.log(`  ${CONTENT_ITEMS.length} content titles`);
  console.log(`  ${ARTIST_ITEMS.length} artists`);
  console.log(`  ${MUSIC_ITEMS.length} music tracks`);
  console.log(`  ${PLATFORM_ADMINS.length} admin accounts`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
