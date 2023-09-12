import Heading from "@/components/heading";
import ViewEntityBox from "@/components/view-entity-box";
import type { Champion } from "@prisma/client";
import Image from "next/image";
import type { Metadata } from "next";
import { db } from "@/utils/db/client";

const getData = async (slug: string) => {
  const champion = await db.champion.findFirstOrThrow({
    where: { slug: slug },
    include: {
      faction: true,
      championStories: {
        include: {
          story: true,
        },
      },
    },
  });
  const stories: number[] = [];
  champion?.championStories.forEach((v) => {
    stories.push(v.storyId);
  });
  const relatedChamps = await db.champion.findMany({
    where: {
      championStories: {
        some: {
          storyId: { in: stories },
          NOT: { championId: champion.id },
        },
      },
    },
  });
  return { championData: champion, relatedChampions: relatedChamps };
};
const ChampionPage = async ({ params }: { params: { slug: string } }) => {
  const grid_layout = "h-auto grid md:grid-cols-2 grid-cols-1 sm:mx-3 mx-1";
  const slug = params.slug;
  const resData = await getData(slug);
  const championData = resData?.championData;
  const relatedChampions = resData?.relatedChampions;

  return (
    <>
      <div className="h-full min-h-screen bg-gray-800 px-3 pt-5 md:pt-2">
        <div className={"w-auto"}>
          <DisplayChampion champion={championData} />
        </div>
        <Heading title={"Stories"} />
        <div className={grid_layout}>
          {championData.championStories.map((story) => (
            <div key={story.storyId} className={"mx-1 sm:mx-3 md:mx-5"}>
              <ViewEntityBox
                entity={{
                  imageUrl: story.story.imageUrl,
                  name: story.story.title,
                  title: championData.name,
                  link: "/story/" + story.story.textId,
                }}
              />
            </div>
          ))}
        </div>
        {championData?.faction && (
          <>
            <Heading title={"Region"} />
            <div className={"w-auto"}>
              <ViewEntityBox
                entity={{
                  imageUrl: championData.faction.imageUrl,
                  title: championData.faction.title,
                  link: "/faction/" + championData.faction.slug,
                }}
              />
            </div>
          </>
        )}
        {relatedChampions?.length > 0 && (
          <>
            <Heading title={"Related Champions"} />
            <div className={grid_layout}>
              {relatedChampions.map((champion) => (
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
          </>
        )}
      </div>
    </>
  );
};
const DisplayChampion: React.FC<{ champion: Champion }> = ({ champion }) => {
  return (
    <div className="container mx-auto py-9 md:py-2">
      <div className="items-strech flex flex-col justify-center ">
        <div className="items-strech flex flex-col justify-between px-1 py-3 md:px-6 md:py-6">
          <h1 className={"pt-3 text-center text-4xl text-white"}>
            {champion.name}
          </h1>
          <h1 className={"pb-3 text-center text-3xl text-white"}>
            {champion.title}
          </h1>
          <div className={"relative h-96"}>
            <Image
              fill
              src={champion.imageUrl}
              className={"rounded-xl object-cover sm:object-contain"}
              alt={champion.name}
              priority={true}
            />
          </div>
          <div className={"py-3 text-center text-xl text-white"}>
            {"Release Date: " + champion.releaseDate?.toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  const champion = await db.champion.findFirstOrThrow({
    where: { slug: slug },
  });
  return {
    title: [champion.name, champion.title].join(" "),
    description: [champion.name, champion.title].join(" "),
  };
}

export async function generateStaticParams() {
  const champions = await db.champion.findMany({ select: { slug: true } });
  return champions.map(({ slug }) => {
    return { slug };
  });
}

export default ChampionPage;
