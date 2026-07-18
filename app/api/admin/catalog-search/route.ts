import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { adminCatalogSearch } from "@/lib/data/admin-catalog-search";
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
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? "40");
  const types = parseTypes(searchParams.get("types"));

  const results = await adminCatalogSearch(
    q,
    types,
    Number.isFinite(limit) ? Math.min(limit, 60) : 40,
  );

  return NextResponse.json({ results });
}
