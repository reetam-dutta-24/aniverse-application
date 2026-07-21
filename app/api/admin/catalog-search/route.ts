import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  adminCatalogLookup,
  adminCatalogSearch,
} from "@/lib/data/admin-catalog-search";
import type { SearchResultType } from "@/lib/search/types";

const ALLOWED_TYPES = new Set<SearchResultType>(["content", "song", "artist"]);

function parseTypes(raw: string | null): SearchResultType[] {
  if (!raw) return ["content", "song", "artist"];
  const types = raw
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is SearchResultType =>
      ALLOWED_TYPES.has(value as SearchResultType),
    );
  return types.length > 0 ? types : ["content", "song", "artist"];
}

export async function GET(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const lookupType = searchParams.get("type") as SearchResultType | null;

  if (slug && lookupType && ALLOWED_TYPES.has(lookupType)) {
    const match = await adminCatalogLookup(slug, lookupType);
    return NextResponse.json({ results: match ? [match] : [] });
  }

  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? "40");
  const types = parseTypes(searchParams.get("types"));
  const browse = searchParams.get("browse") === "1";

  const results = await adminCatalogSearch(
    q,
    types,
    Number.isFinite(limit) ? Math.min(limit, 60) : 40,
    browse,
  );

  return NextResponse.json({ results });
}
