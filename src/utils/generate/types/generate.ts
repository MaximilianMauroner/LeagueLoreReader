import { z } from "zod";

export const factionsSchema = z.object({
  id: z.string(),
  name: z.string(),
  locale: z.string(),
  subheadline: z.string(),
  factions: z.array(
    z.object({
      type: z.string(),
      name: z.string(),
      slug: z.string(),
      image: z.object({
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        uri: z.string(),
        encoding: z.string(),
        width: z.null(),
        height: z.null(),
        x: z.null(),
        y: z.null(),
        "featured-champions": z.array(z.unknown()),
      }),
      echelon: z.number(),
      "associated-champions": z.null(),
    }),
  ),
});

export const singleFactionSchema = z.object({
  id: z.string(),
  name: z.string(),
  locale: z.string(),
  faction: z.object({
    overview: z.object({ short: z.string() }),
  }),
});

export const championsSchema = z.object({
  id: z.string(),
  name: z.string(),
  locale: z.string(),
  subheadline: z.string(),
  champions: z.array(
    z.object({
      type: z.string(),
      "release-date": z.string(),
      name: z.string(),
      title: z.string(),
      "section-title": z.string(),
      slug: z.string(),
      "associated-faction": z.string(),
      "associated-faction-slug": z.string(),
      image: z.object({
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        uri: z.string(),
        encoding: z.string(),
        width: z.number(),
        height: z.number(),
        x: z.number(),
        y: z.number(),
        "featured-champions": z.array(z.unknown()),
      }),
      background: z.object({
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        uri: z.string(),
        encoding: z.string(),
        width: z.number(),
        height: z.number(),
        x: z.number(),
        y: z.number(),
        "featured-champions": z.array(z.unknown()),
      }),
      url: z.string(),
    }),
  ),
});

export const singleChampionSchema = z.object({
  champion: z.object({
    title: z.string(),
    slug: z.string(),
    biography: z.object({
      full: z.string(),
    }),
    image: z.object({
      uri: z.string(),
    }),
  }),
});

export type FactionsType = z.infer<typeof factionsSchema>;
export type SingleFactionType = z.infer<typeof singleFactionSchema>;
export type ChampionsType = z.infer<typeof championsSchema>;
export type SingleChampionType = z.infer<typeof singleChampionSchema>;
