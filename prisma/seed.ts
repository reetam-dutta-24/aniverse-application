import bcrypt from "bcryptjs";
import { PrismaClient, PlatformRole } from "@prisma/client";
import { CATALOG_SEED_ITEMS } from "../lib/catalog-seed-data";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

const MEDIA_MAP = {
  anime: "ANIME",
  show: "SHOW",
  movie: "MOVIE",
  documentary: "DOCUMENTARY",
  kdrama: "KDRAMA",
  song: "SONG",
  album: "ALBUM",
  artist: "ARTIST",
  playlist: "PLAYLIST",
} as const;

async function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@aniverse.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const name = process.env.ADMIN_NAME ?? "AniVerse Admin";
  const handle = (process.env.ADMIN_HANDLE ?? "aniverse_admin")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 30);

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      handle,
      name,
      passwordHash,
      role: PlatformRole.SUPER_ADMIN,
      onboardingCompletedAt: new Date(),
      aiTasteScore: 100,
      preferences: { create: {} },
    },
    update: {
      role: PlatformRole.SUPER_ADMIN,
      name,
      passwordHash,
    },
    select: { email: true, handle: true, role: true },
  });

  console.log(`Admin user ready: ${admin.email} (@${admin.handle}) [${admin.role}]`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log("Default admin password: Admin123! — change it after first login.");
  }
}

async function seedCatalog() {
  let created = 0;
  let updated = 0;

  for (const item of CATALOG_SEED_ITEMS) {
    const genreRows = await Promise.all(
      item.genreLabels.map((label) =>
        prisma.genre.upsert({
          where: { label },
          create: { label },
          update: {},
        }),
      ),
    );

    const existing = await prisma.content.findUnique({
      where: { slug: item.slug },
      select: { id: true },
    });

    const data = {
      title: item.title,
      type: MEDIA_MAP[item.type],
      description: item.description ?? null,
      synopsis: item.synopsis ?? item.description ?? null,
      imageUrl: item.imageUrl ?? null,
      rating: item.rating ?? null,
      year: item.year ?? null,
      meta: item.meta ?? null,
      accent: item.accent ?? null,
    };

    const content = existing
      ? await prisma.content.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.content.create({
          data: { slug: item.slug, ...data },
        });

    await prisma.contentGenre.deleteMany({ where: { contentId: content.id } });
    await prisma.contentGenre.createMany({
      data: genreRows.map((genre) => ({
        contentId: content.id,
        genreId: genre.id,
      })),
      skipDuplicates: true,
    });

    if (existing) updated += 1;
    else created += 1;
  }

  console.log(`Catalog seed complete: ${created} created, ${updated} updated.`);
}

async function main() {
  await seedAdminUser();
  await seedCatalog();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
