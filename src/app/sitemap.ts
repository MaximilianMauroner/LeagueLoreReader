import type { MetadataRoute } from "next";
import { generateStaticParams as genChamp } from "./champion/[slug]/page";
import { generateStaticParams as genStory } from "./story/[slug]/page";
import { generateStaticParams as genFaction } from "./faction/[slug]/page";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const championParams = await genChamp();
  const storyParams = await genStory();
  const factionParams = await genFaction();
  const baseUrl = process.env.NEXTAUTH_URL;
  return [
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
