import type { MetadataRoute } from "next";
// import { generateStaticParams as genChamp } from "./champion/[slug]/page";
// import { generateStaticParams as genFaction } from "./faction/[slug]/page";
import { db } from "@/utils/db/client";

const tempGeneratePaths = async () => {
  const stories = await db.story.findMany({ select: { textId: true } });
  return stories.map(({ textId }) => {
    return { slug: textId };
  });
};

export default function sitemap(): MetadataRoute.Sitemap {
  // const championParams = await genChamp();
  // const storyParams = await tempGeneratePaths();
  // const factionParams = await genFaction();
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
  return [
    {
      url: `${baseUrl}`,
      priority: 0.9,
    },
    // {
    //   url: `${baseUrl}/faction`,
    //   priority: 0.9,
    // },
    // {
    //   url: `${baseUrl}/champion`,
    //   priority: 0.9,
    // },
    // {
    //   url: `${baseUrl}/story`,
    //   priority: 0.9,
    // },
    // ...championParams.map((params) => ({
    //   url: `${baseUrl}/champion/${params.slug}`,
    //   priority: 0.5,
    // })),
    // ...storyParams.map((params) => ({
    //   url: `${baseUrl}/story/${params.slug}`,
    //   priority: 0.5,
    // })),
    // ...factionParams.map((params) => ({
    //   url: `${baseUrl}/story/${params.slug}`,
    //   priority: 0.5,
    // })),
  ];
}
