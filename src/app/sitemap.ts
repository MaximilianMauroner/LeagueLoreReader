import { generateStaticParams as genChamp } from "./champion/[slug]/page";
import { generateStaticParams as genStory } from "./story/[slug]/page";
import { generateStaticParams as genFaction } from "./faction/[slug]/page";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const championParams = await genChamp();
  const storyParams = await genStory();
  const factionParams = await genFaction();
  const baseUrl = process.env.NEXTAUTH_URL;
  return [
    {
      url: `${baseUrl}`,
      priority: 1,
    },
    {
      url: `${baseUrl}/faction`,
      priority: 1,
    },
    {
      url: `${baseUrl}/champion`,
      priority: 1,
    },
    {
      url: `${baseUrl}/story`,
      priority: 1,
    },
    ...championParams.map((params) => ({
      url: `${baseUrl}/champion/${params.slug}`,
      priority: 0.5,
    })),
    ...storyParams.map((params) => ({
      url: `${baseUrl}/story/${params.slug}`,
      priority: 0.5,
    })),
    ...factionParams.map((params) => ({
      url: `${baseUrl}/story/${params.slug}`,
      priority: 0.5,
    })),
  ];
}
