import Heading from "@/components/heading";
import ViewEntityBox from "@/components/view-entity-box";
import { db } from "@/server/db/client";
import type { Champion, Faction } from "@prisma/client";
import type { Metadata } from "next";
import Image from "next/image";
import React from "react";

const FactionPage = async ({ params }: { params: { slug: string } }) => {
  const grid_layout =
    "h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1";
  const slug = params.slug;
  const faction = await db.faction.findFirstOrThrow({
    where: { slug: slug },
    include: { champions: true },
  });

  return (
    <>
      <div className="h-full min-h-screen bg-gray-800 px-3 pt-5 md:pt-2">
        <DisplayFaction faction={faction} />
        <Heading title={"Champions"} />
        <div className={grid_layout}>
          {faction.champions.map((champion) => (
            <div key={champion.id} className={"mx-1 sm:mx-3 md:mx-5"}>
              <ViewEntityBox
                entity={{
                  imageUrl: champion.imageUrl,
                  name: champion.name,
                  title: champion.title!,
                  link: "/champion/" + champion.slug,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const DisplayFaction: React.FC<{
  faction: Faction & { champions: Champion[] };
}> = ({ faction }) => {
  const description = faction.description;
  return (
    <div className="container mx-auto py-9 md:py-2">
      <div className="items-strech flex flex-col justify-center ">
        <div className="items-strech flex flex-col justify-between px-1 py-3 md:px-6 md:py-6">
          <h1 className={"pt-3 text-center text-4xl text-white"}>
            {faction.title}
          </h1>
          <h3 className={"pb-3 text-center text-xl text-white"}>
            <span className={"text-3xl font-bold"}>
              {faction?.champions.length}
            </span>
            &nbsp;Champions are part of this Faction
          </h3>
          <div className={"relative h-96"}>
            <Image
              fill
              src={faction.imageUrl}
              className={"rounded-xl object-cover sm:object-contain"}
              alt={faction.title}
              priority={true}
            />
          </div>
          <span
            className={"py-3 text-gray-700 dark:text-white "}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
};
export default FactionPage;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  const faction = await db.faction.findFirstOrThrow({
    where: { slug: slug },
  });
  return {
    title: faction.title,
    description: faction.description,
  };
}
