import { generateStaticParams as genChamp } from "./champion/[slug]/page";
import { generateStaticParams as genStory } from "./story/[slug]/page";
import { generateStaticParams as genFaction } from "./faction/[slug]/page";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const championParams = await genChamp();
  const storyParams = await genStory();
  const factionParams = await genFaction();
  const url = process.env.NEXT_PUBLIC_VERCEL_URL;
  return [
    {
      url: `${url}`,
      priority: 1,
    },
    {
      url: `${url}/faction`,
      priority: 1,
    },
    {
      url: `${url}/champion`,
      priority: 1,
    },
    {
      url: `${url}/story`,
      priority: 1,
    },
    ...championParams.map((params) => ({
      url: `${url}/champion/${params.slug}`,
      priority: 0.5,
    })),
    ...storyParams.map((params) => ({
      url: `${url}/story/${params.slug}`,
      priority: 0.5,
    })),
    ...factionParams.map((params) => ({
      url: `${url}/story/${params.slug}`,
      priority: 0.5,
    })),
  ];
}
