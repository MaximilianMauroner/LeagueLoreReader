import { env } from "@/env.mjs";
import { db } from "../db/client";
import type {
  FactionsType,
  SingleFactionType,
  ChampionsType,
  SingleChampionType,
} from "./types/generate";
import {
  factionsSchema,
  singleFactionSchema,
  championsSchema,
  singleChampionSchema,
} from "./types/generate";
import { StoryType, type Champion, type Faction } from "@prisma/client";

export const createFactions = async () => {
  const response = await fetch(env.FACTION_URL);
  const data = (await response.json()) as FactionsType;
  factionsSchema.parse(data);
  for (const faction of data.factions) {
    await db.faction.upsert({
      where: {
        slug: faction.slug,
      },
      update: {
        title: faction.name,
        slug: faction.slug,
        url: env.SINGLE_FACTION_URL.replace("factionName", faction.slug),
        imageUrl: faction.image.uri,
      },
      create: {
        title: faction.name,
        slug: faction.slug,
        description: "",
        url: env.SINGLE_FACTION_URL.replace("factionName", faction.slug),
        imageUrl: faction.image.uri,
      },
    });
  }
  return db.faction.findMany();
};

export const updateIndividualFaction = async (faction: Faction) => {
  const data = await fetch(faction.url);
  const jsonData = (await data.json()) as SingleFactionType;
  singleFactionSchema.parse(jsonData);
  await db.faction.update({
    where: {
      id: faction.id,
    },
    data: {
      description: jsonData.faction.overview.short ?? "",
    },
  });
  return faction;
};

export const createChampions = async () => {
  const response = await fetch(env.CHAMPIONS_URL);
  const data = (await response.json()) as ChampionsType;
  championsSchema.parse(data);
  for (const champion of data.champions) {
    const faction = await db.faction.findFirst({
      select: { id: true },
      where: { slug: champion["associated-faction-slug"] },
    });
    await db.champion.upsert({
      where: {
        slug: champion.slug,
      },
      update: {
        name: champion.name,
        slug: champion.slug,
        releaseDate: champion["release-date"],
        url: env.SINGLE_CHAMPION_URL.replace("championSlug", champion.slug),
        imageUrl: champion.image.uri,
        factionId: faction?.id,
      },
      create: {
        name: champion.name,
        slug: champion.slug,
        releaseDate: champion["release-date"],
        url: env.SINGLE_CHAMPION_URL.replace("championSlug", champion.slug),
        imageUrl: champion.image.uri,
        factionId: faction?.id,
      },
    });
  }
};

export const updateIndividualChampion = async (champion: Champion) => {
  const data = await fetch(champion.url);
  const jsonData = (await data.json()) as SingleChampionType;
  singleChampionSchema.parse(jsonData);
  await db.champion.update({
    where: {
      id: champion.id,
    },
    data: {
      title: jsonData.champion.title ?? "",
    },
  });
};

export const createStory = (champion: SingleChampionType["champion"]) => {
  const story = {
    title: champion.title,
    textId: champion.slug,
    htmlStory: champion.biography.full,
    type: StoryType.BIOGRAPHY,
    imageUrl: champion.image.uri,
  };
  return story;
};
