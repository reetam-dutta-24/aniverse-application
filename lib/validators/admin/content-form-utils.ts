import type { ContentFormInput } from "@/lib/validators/admin/content";

/** Drop incomplete nested rows and normalize optional enums before API validation. */
export function sanitizeContentFormForSubmit(form: ContentFormInput): ContentFormInput {
  return {
    ...form,
    accent: form.accent || undefined,
    highlightTags: form.highlightTags.filter((tag) => tag.trim().length > 0),
    seasons: form.seasons.filter((season) => season.label.trim().length > 0),
    episodes: form.episodes
      .filter((episode) => episode.title.trim().length > 0)
      .map((episode) => ({
        ...episode,
        language: episode.language?.trim() ? episode.language : undefined,
      })),
    characters: form.characters
      .filter((character) => character.name.trim().length > 0)
      .map((character) => ({
        ...character,
        accent: character.accent || undefined,
      })),
    catalogReviews: form.catalogReviews
      .filter(
        (review) => review.authorName.trim().length > 0 && review.body.trim().length > 0,
      )
      .map((review) => ({
        ...review,
        accent: review.accent || undefined,
        authorAvatarColor: review.authorAvatarColor?.trim() || undefined,
      })),
    featuredTrackSlugs: form.featuredTrackSlugs.filter((slug) => slug.trim().length > 0),
    relatedContentSlugs: form.relatedContentSlugs.filter((slug) => slug.trim().length > 0),
  };
}
