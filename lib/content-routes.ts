/** Normalize carousel pool IDs to a stable content detail slug. */
export function normalizeContentSlug(id: string): string {
  const aliases: Record<string, string> = {
    jjk: "jujutsu-kaisen",
    aot: "attack-on-titan",
    spy: "spy-x-family",
    vinland: "vinland-saga",
    oshio: "oshi-no-ko",
    classroom: "classroom-of-elite",
  };

  const stripped = id
    .replace(/-(t|r|n|cw|cl|m)$/i, "")
    .replace(/-\d+$/, "");

  return aliases[stripped] ?? stripped;
}

export function getContentDetailPath(contentId: string): string {
  return `/content/${normalizeContentSlug(contentId)}`;
}
