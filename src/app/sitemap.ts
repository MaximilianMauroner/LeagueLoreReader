import { generateStaticParams as genChamp } from "./champion/[slug]/page";
import { generateStaticParams as genStory } from "./story/[slug]/page";
import { generateStaticParams as genFaction } from "./faction/[slug]/page";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const championParams = await genChamp();
  const storyParams = await genStory();
  const factionParams = await genFaction();
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
  return [
    {
      url: `${baseUrl}`,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/faction`,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/champion`,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/story`,
      priority: 1.0,
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
