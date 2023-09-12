import ViewEntityBox from "@/components/view-entity-box";
import { db } from "@/utils/db/client";
import type { Champion, Faction } from "@prisma/client";
import type { Metadata } from "next";
import { type ReactElement } from "react";

const box_class = "md:mx-5 sm:mx-3 mx-1";

const Home = async () => {
  const grid_layout =
    "h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1";
  const combinedData: ReactElement[] = [];
  const factions = await getRandomFactionWithLimit(5);
  const champions = await getRandomChampionsWithLimit(10);
  const stories = await getRandomStoriesWithLimit(15);

  const shuffle = (array: ReactElement[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      array[i] = array[j];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      array[j] = temp;
    }
  };
  prepareFactionData(factions, combinedData);
  prepareStoryData(stories, combinedData);
  prepareChampionData(champions, combinedData);
  shuffle(combinedData);

  return (
    <>
      <main className="px-1 pt-5 sm:px-3 md:pt-2">
        <div className={grid_layout}>{combinedData}</div>
      </main>
    </>
  );
};

export const metadata: Metadata = {
  title: "League of Legends Lore Reader",
  description:
    "You can read and more importantly listen to the all the stories of the characters from League of Legends.",
};

export default Home;

const getRandomChampionsWithLimit = async (limit: number) => {
  const count = await db.champion.count();
  const ids = randomUniqueNum(count, limit);
  return await db.champion.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

const getRandomFactionWithLimit = async (limit: number) => {
  const count = await db.faction.count();
  const ids = randomUniqueNum(count, limit);
  return await db.faction.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

const getRandomStoriesWithLimit = async (limit: number) => {
  const count = await db.story.count();
  const ids = randomUniqueNum(count, limit);
  return await db.story.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      championStories: {
        include: { champion: true },
      },
    },
  });
};

function prepareFactionData(factions: Faction[], combinedData: ReactElement[]) {
  factions.forEach((faction) => {
    combinedData.push(
      <div key={faction.slug} className={box_class}>
        <ViewEntityBox
          entity={{
            imageUrl: faction.imageUrl,
            title: faction.title,
            link: "/faction/" + faction.slug,
          }}
        />
      </div>,
    );
  });
}

type StoryType = Awaited<ReturnType<typeof getRandomStoriesWithLimit>>[0];
function prepareStoryData(stories: StoryType[], combinedData: ReactElement[]) {
  stories.forEach((story: StoryType) => {
    combinedData.push(
      <div key={story.textId} className={box_class}>
        <ViewEntityBox
          entity={{
            imageUrl: story.imageUrl,
            name: story.title,
            title: story.championStories
              .map((es) => es.champion.name)
              .join(", "),
            link: "/story/" + story.textId,
          }}
        />
      </div>,
    );
  });
}

function prepareChampionData(
  champions: Champion[],
  combinedData: ReactElement[],
) {
  champions.forEach((champion) => {
    combinedData.push(
      <div key={champion.id} className={box_class}>
        <ViewEntityBox
          entity={{
            imageUrl: champion.imageUrl,
            name: champion.name,
            title: champion.title!,
            link: "/champion/" + champion.slug,
          }}
        />
      </div>,
    );
  });
}

function randomUniqueNum(range: number, outputCount: number) {
  const arr: number[] = [];
  for (let i = 1; i <= range; i++) {
    arr.push(i);
  }

  const result: number[] = [];

  for (let i = 1; i <= outputCount; i++) {
    const random = Math.floor(Math.random() * (range - i));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    result.push(arr[random]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    arr[random] = arr[range - i];
  }

  return result;
}
