import { roundRating } from "@/lib/format-rating";
import type { ContentNestedSeed, EpisodeSeed } from "./helpers";

function ep(
  seasonNumber: number,
  number: number,
  title: string,
  description: string,
  opts: { duration?: string; language?: string; rating?: number } = {},
): EpisodeSeed {
  return {
    seasonNumber,
    number,
    title,
    description,
    duration: opts.duration ?? "24 Min",
    language: (opts.language as EpisodeSeed["language"]) ?? "japanese",
    rating: opts.rating ?? roundRating(8.4 + (number % 5) * 0.1) ?? 8.4,
    thumbnailUrl: undefined,
  };
}

const DEATH_NOTE_EPISODES: Array<{ title: string; description: string }> = [
  { title: "Rebirth", description: "Light Yagami finds the Death Note and tests its power on criminals, drawing the attention of the mysterious detective L." },
  { title: "Confrontation", description: "L publicly challenges Kira on live television, forcing Light to adapt his strategy without revealing himself." },
  { title: "Dealings", description: "Light and L begin their psychological chess match as the Japanese task force forms around L's investigation." },
  { title: "Pursuit", description: "L narrows the suspect pool while Light uses the Death Note's rules to stay ahead of surveillance." },
  { title: "Tactics", description: "Light manipulates FBI agents sent to Japan, escalating the stakes of the Kira investigation." },
  { title: "Unraveling", description: "Raye Penber's death triggers suspicion, and L pushes harder to expose Kira's identity." },
  { title: "Overcast", description: "The task force debates Kira's justice as Light balances school life with his secret crusade." },
  { title: "Glare", description: "L installs cameras in Light's home, leading to a tense battle of composure between the two geniuses." },
  { title: "Sidetrack", description: "Light temporarily relinquishes the Death Note to clear suspicion, losing all memory of being Kira." },
  { title: "Doubt", description: "Without his memories, Light joins the investigation earnestly while L continues to observe him." },
  { title: "Assault", description: "Misa Amane enters the story with her own Death Note and devotion to Kira, complicating the hunt." },
  { title: "Love", description: "Misa's affection for Light becomes leverage as L discovers the second Kira." },
  { title: "Confessions", description: "Misa is captured and Light must choose how far he will go to protect his identity." },
  { title: "Friend", description: "Light and Misa accept shinigami eyes, trading half their lifespans for power over their enemies." },
  { title: "Wager", description: "L detains Light and Misa, testing whether Kira can kill without access to the notebook." },
  { title: "Decision", description: "Rem the shinigami intervenes, sacrificing herself to save Misa and eliminate L's advantage." },
  { title: "Execution", description: "L's time runs out as Light's plan reaches its deadliest phase inside the task force." },
  { title: "Ally", description: "With L gone, Light inherits the role of the world's greatest detective while ruling as Kira." },
  { title: "Matsuda", description: "The task force struggles under Light's leadership as Kira's influence spreads globally." },
  { title: "Makeshift", description: "Near and Mello enter the picture, heirs to L's legacy and new threats to Light's reign." },
  { title: "Performance", description: "Mello orchestrates a bold kidnapping to draw Kira out of hiding." },
  { title: "Guidance", description: "Near assembles the SPK to challenge Kira with a different kind of investigation." },
  { title: "Frenzy", description: "The race for the Death Note intensifies as both sides sacrifice pawns for advantage." },
  { title: "Revival", description: "Misa regains her memories while Light prepares for the final phase against Near and Mello." },
  { title: "Silence", description: "The task force fractures as suspicion grows around Light's true identity." },
  { title: "Renewal", description: "Near closes in with evidence while Light pushes to eliminate every remaining obstacle." },
  { title: "Abduction", description: "Sayu is taken hostage, forcing the task force into Mello's dangerous trap." },
  { title: "Impatience", description: "Light makes impossible choices to recover the notebook and protect his empire." },
  { title: "Father", description: "Soichiro Yagami's final stand tests his faith in justice and his love for his family." },
  { title: "Justice", description: "Mikami becomes a devoted instrument of Kira, executing Light's will with terrifying precision." },
  { title: "Transfer", description: "Near sets the stage for a final confrontation by controlling the flow of the notebooks." },
  { title: "Selection", description: "The warehouse meeting approaches as every surviving player chooses a side." },
  { title: "Scorn", description: "Mello's last gamble reshapes the board moments before the endgame begins." },
  { title: "Vigilance", description: "Near and Light face off through proxies, each convinced victory is within reach." },
  { title: "Malice", description: "Mikami's devotion threatens to expose Light in the one place he cannot afford to fail." },
  { title: "1.28", description: "The truth erupts in the Yellow Box warehouse as Light's identity is finally revealed." },
  { title: "New World", description: "Light's reign ends and the world must decide what justice means without Kira." },
];

const ALICE_EPISODES: Array<{ season: number; title: string; description: string }> = [
  { season: 1, title: "Episode 1", description: "Arisu, Karube, and Chota are pulled into an empty Tokyo and must survive their first lethal game in the Shibuya crossing." },
  { season: 1, title: "Episode 2", description: "The trio learns how visas and game arenas work as the cost of failure becomes brutally clear." },
  { season: 1, title: "Episode 3", description: "Arisu meets Usagi and discovers that teamwork may be the only way to extend their lives." },
  { season: 1, title: "Episode 4", description: "A tag game in the botanical garden forces players to choose between trust and survival." },
  { season: 1, title: "Episode 5", description: "The Beach faction emerges, and Arisu is drawn into a community ruled by Hatter's charisma." },
  { season: 1, title: "Episode 6", description: "Tensions inside the Beach rise as players scramble to collect playing cards for safe passage." },
  { season: 1, title: "Episode 7", description: "A witch hunt game turns friends against one another with deadly consequences." },
  { season: 1, title: "Episode 8", description: "Arisu uncovers the truth behind the witch trial and the price of leadership in the Borderland." },
  { season: 2, title: "Episode 1", description: "Returning to the Borderland, Arisu faces a new class of games designed to break the survivors psychologically." },
  { season: 2, title: "Episode 2", description: "Usagi and Arisu reunite as the games demand sacrifices that no player wants to make." },
  { season: 2, title: "Episode 3", description: "A croquet game with the Queen of Hearts forces Arisu to confront grief and guilt directly." },
  { season: 2, title: "Episode 4", description: "Kyuma challenges Arisu's philosophy of life in a game where conviction becomes ammunition." },
  { season: 2, title: "Episode 5", description: "The team enters a lethal dance battle where rhythm and coordination decide who lives." },
  { season: 2, title: "Episode 6", description: "Aguni hunts Arisu through the city as the Borderland pushes everyone toward a final verdict." },
  { season: 2, title: "Episode 7", description: "Arisu faces the ultimate game and must decide whether the Borderland offers escape or oblivion." },
  { season: 2, title: "Episode 8", description: "The survivors learn what the Borderland truly wants as the season closes on a haunting choice." },
];

const MONEY_HEIST_EPISODES: Array<{ season: number; title: string; description: string }> = [
  { season: 1, title: "Efectuar lo acordado", description: "The Professor recruits eight criminals and launches the Royal Mint heist with a meticulously timed plan." },
  { season: 1, title: "Imprudencias letales", description: "Hostage tensions rise as Berlin enforces discipline inside the mint and the police close in outside." },
  { season: 1, title: "Errar al disparar", description: "Tokyo's impulsive actions threaten the operation while Arturo Román becomes a dangerous wildcard." },
  { season: 1, title: "Caballo de Troya", description: "The team executes a bold move to extend the siege and keep the police guessing." },
  { season: 1, title: "Hacer la vaca", description: "Personal betrayals and romantic entanglements begin to fracture the group's unity." },
  { season: 1, title: "La cálida España", description: "Flashbacks reveal how the Professor prepared each member for the impossible job." },
  { season: 1, title: "La hora de la verdad", description: "Moscow's health crisis and police psychology warfare push the robbers toward their first major loss." },
  { season: 1, title: "El que la sigue la consigue", description: "The crew fights to maintain control as Raquel closes in on the Professor's identity." },
  { season: 1, title: "El 1929", description: "Berlin's leadership is questioned while the team scrambles to print money under mounting pressure." },
  { season: 1, title: "La moneda de cambio", description: "Negotiations turn deadly as the robbers demand freedom for one hostage in exchange for proof of life." },
  { season: 1, title: "La decimotercera hora", description: "The Professor executes a diversion that reshapes the entire siege at the mint." },
  { season: 1, title: "Llegó la hora", description: "The first heist reaches its explosive conclusion as escape routes are tested and loyalties break." },
  { season: 1, title: "Pase lo que pase", description: "The aftermath of the mint robbery scatters the survivors and sets up a larger war with the authorities." },
  { season: 2, title: "Seis meses después", description: "The gang reunites for an even bolder target: the Bank of Spain and its gold reserves." },
  { season: 2, title: "El amor es una rebelión", description: "New relationships and old wounds complicate preparation for the second heist." },
  { season: 2, title: "El tiempo de la alegría", description: "The Professor times the Bank of Spain assault to coincide with chaos in the streets." },
  { season: 2, title: "El turno de la mañana", description: "Inside the bank, Nairobi leads printing operations while Lisbon struggles with captivity." },
  { season: 2, title: "El sueño de la razón", description: "Colonel Tamayo and Alicia Sierra escalate tactics as the team loses room to maneuver." },
  { season: 2, title: "La caja de música", description: "Palermo takes command during a crisis that threatens to end the heist early." },
  { season: 2, title: "La carrera contraria", description: "The Professor's network is compromised, forcing improvised countermeasures." },
  { season: 2, title: "La fábrica de moneda y timbre", description: "The crew digs in for a long siege while printing money under military pressure." },
  { season: 2, title: "Exhumación", description: "A shocking discovery outside the bank shifts public sympathy and police strategy." },
  { season: 2, title: "La deriva del amor", description: "Emotional fractures inside the team mirror the chaos unfolding in Madrid." },
  { season: 2, title: "La casa de papel", description: "Tokyo narrates the gang's mythology as the Bank of Spain operation reaches a turning point." },
  { season: 2, title: "El atraco más grande de la historia", description: "The Professor unveils a contingency plan that could save or destroy everyone inside." },
  { season: 3, title: "Trabajo de fuga", description: "Two years later, the crew is scattered and hunted while planning an impossible rescue." },
  { season: 3, title: "La codicia es un juego", description: "Stockholm and Denver lead a risky operation to recover a captured teammate." },
  { season: 3, title: "El tiempo de la alegría", description: "Flashbacks reveal how the Professor prepared for betrayal and collapse." },
  { season: 3, title: "El turno de la noche", description: "The Bank of Spain siege intensifies as military forces prepare a final assault." },
  { season: 3, title: "La cirugía de la confianza", description: "Alicia Sierra plays both sides while the gang fights to keep the gold heist alive." },
  { season: 3, title: "El eco de la bala", description: "Sacrifices inside the bank force the Professor to rewrite the ending of his plan." },
  { season: 3, title: "La deriva del dolor", description: "Grief and rage push Tokyo toward a decision that could end the resistance." },
  { season: 3, title: "El final del camino", description: "The crew chooses between escape, martyrdom, and the legacy of the red jumpsuit." },
  { season: 3, title: "Una familia feliz", description: "The Professor's final gambit tests whether the heist was ever about money at all." },
  { season: 3, title: "La última hora", description: "Police and robbers collide in the vault as the gold becomes both prize and trap." },
  { season: 3, title: "El principio del fin", description: "Allies fall and loyalties invert as the operation enters its deadliest phase." },
  { season: 3, title: "Parte 5 Vol 2", description: "The remaining crew executes the Professor's last instructions under impossible odds." },
];

export const DETAILED_EPISODE_SLUGS = new Set([
  "death-note",
  "alice-in-borderland",
  "money-heist",
  "elite",
]);

export function getDetailedNested(slug: string): ContentNestedSeed | null {
  if (slug === "death-note") {
    const episodes = DEATH_NOTE_EPISODES.map((entry, index) =>
      ep(1, index + 1, entry.title, entry.description, {
        duration: "23 Min",
        language: "japanese",
        rating: roundRating(8.6 + (index % 7) * 0.05) ?? 8.6,
      }),
    );
    return {
      seasons: [{ label: "Season 1", episodeCount: 37 }],
      episodes,
      characters: [
        { name: "Light Yagami", role: "Protagonist", voiceActor: "Mamoru Miyano", accent: "blue" },
        { name: "L", role: "Detective", voiceActor: "Kappei Yamaguchi", accent: "cyan" },
        { name: "Ryuk", role: "Shinigami", voiceActor: "Nakamura Shidō", accent: "purple" },
        { name: "Misa Amane", role: "Supporting", voiceActor: "Aya Hirano", accent: "pink" },
      ],
      relatedSlugs: ["death-parade", "tokyo-ghoul", "classroom-of-the-elite"],
    };
  }

  if (slug === "alice-in-borderland") {
    const seasonCounters = new Map<number, number>();
    const episodes = ALICE_EPISODES.map((entry) => {
      const next = (seasonCounters.get(entry.season) ?? 0) + 1;
      seasonCounters.set(entry.season, next);
      return ep(entry.season, next, entry.title, entry.description, {
        duration: "48 Min",
        language: "japanese",
        rating: roundRating(7.8 + next * 0.1) ?? 7.8,
      });
    });
    return {
      seasons: [
        { label: "Season 1", episodeCount: 8 },
        { label: "Season 2", episodeCount: 8 },
      ],
      episodes,
      characters: [
        { name: "Arisu", role: "Protagonist", accent: "cyan" },
        { name: "Usagi", role: "Ally", accent: "pink" },
        { name: "Hatter", role: "Leader", accent: "yellow" },
        { name: "Chishiya", role: "Strategist", accent: "purple" },
      ],
      relatedSlugs: ["squid-game", "all-of-us-are-dead", "dark"],
    };
  }

  if (slug === "money-heist") {
    const seasonCounters = new Map<number, number>();
    const episodes = MONEY_HEIST_EPISODES.map((entry) => {
      const next = (seasonCounters.get(entry.season) ?? 0) + 1;
      seasonCounters.set(entry.season, next);
      return ep(entry.season, next, entry.title, entry.description, {
        duration: "50 Min",
        language: "english",
        rating: roundRating(8.1 + next * 0.05) ?? 8.1,
      });
    });
    const s1 = seasonCounters.get(1) ?? 13;
    const s2 = seasonCounters.get(2) ?? 9;
    const s3 = seasonCounters.get(3) ?? 15;
    return {
      seasons: [
        { label: "Part 1", episodeCount: s1 },
        { label: "Part 2", episodeCount: s2 },
        { label: "Part 3", episodeCount: s3 },
      ],
      episodes,
      characters: [
        { name: "The Professor", role: "Mastermind", accent: "red" },
        { name: "Tokyo", role: "Narrator", accent: "pink" },
        { name: "Berlin", role: "Leader", accent: "cyan" },
        { name: "Nairobi", role: "Forgery Expert", accent: "yellow" },
      ],
      relatedSlugs: ["squid-game", "breaking-bad", "dark"],
    };
  }

  if (slug === "elite") {
    const ELITE_S1 = [
      { title: "Welcome", description: "Three scholarship students arrive at Las Encinas and immediately clash with the elite." },
      { title: "The Minute of Silence", description: "Marina's death shocks the school and suspicion spreads through every clique." },
      { title: "Sara", description: "Nadia struggles with family expectations while Samuel grows closer to Carla." },
      { title: "Love You", description: "Relationships tighten as the investigation into Marina's murder intensifies." },
      { title: "Go Big or Go Home", description: "Secrets from the past resurface and alliances begin to fracture." },
      { title: "If You Missed What's Right in Front of You, You Will Crucify Yourself", description: "Guilty parties scramble as new evidence points toward the killer." },
      { title: "Everything Will Be Alright", description: "The students confront the fallout of their choices before the truth breaks." },
      { title: "Asshole", description: "Season one closes with a confession that reshapes every relationship at Las Encinas." },
    ];
    const ELITE_S2 = [
      { title: "0 Hours Missing", description: "Samuel returns to Las Encinas while a new disappearance grips the school." },
      { title: "Two Meters Underground", description: "The search for a missing student forces old rivals into uneasy cooperation." },
      { title: "The Juniper Tree", description: "Ari and Benjamin's arrival stirs jealousy, ambition, and fresh scandals." },
      { title: "Fifty Meters Underground", description: "Tensions explode as the missing-person case collides with class politics." },
      { title: "Revenge", description: "Past betrayals fuel retaliation among the students and their families." },
      { title: "0.1 Millimeters", description: "Small lies snowball into a crisis that threatens everyone's future." },
      { title: "0 Kilometers", description: "The group closes in on the truth behind the latest disappearance." },
      { title: "One Week", description: "Season two ends with consequences that will define Las Encinas for years." },
    ];

    const episodes = [
      ...ELITE_S1.map((entry, index) =>
        ep(1, index + 1, entry.title, entry.description, {
          duration: "50 Min",
          language: "english",
          rating: roundRating(7.6 + index * 0.05) ?? 7.6,
        }),
      ),
      ...ELITE_S2.map((entry, index) =>
        ep(2, index + 1, entry.title, entry.description, {
          duration: "50 Min",
          language: "english",
          rating: roundRating(7.7 + index * 0.05) ?? 7.7,
        }),
      ),
    ];

    return {
      seasons: [
        { label: "Season 1", episodeCount: 8 },
        { label: "Season 2", episodeCount: 8 },
      ],
      episodes,
      characters: [
        { name: "Samuel", role: "Protagonist", accent: "cyan" },
        { name: "Carla", role: "Elite Student", accent: "pink" },
        { name: "Guzmán", role: "Rival", accent: "red" },
        { name: "Nadia", role: "Scholarship Student", accent: "purple" },
      ],
      relatedSlugs: ["money-heist", "control-z", "class"],
    };
  }

  return null;
}
