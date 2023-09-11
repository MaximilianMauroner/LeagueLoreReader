import ViewEntityBox from "@/components/view-entity-box";
import { db } from "@/server/db/client";
import type { Metadata } from "next";

const AllStories = async () => {
  const grid_layout =
    "h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1";
  const stories = await db.story.findMany({
    include: { championStories: { include: { champion: true } } },
  });
  return (
    <>
      <div className="h-full min-h-screen bg-gray-800 px-1 pt-5 sm:px-3 md:pt-2 ">
        <div className={grid_layout}>
          {stories?.map((story) => (
            <div key={story.textId} className={"mx-1 sm:mx-3 md:mx-5"}>
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export const metadata: Metadata = {
  title: "All Stories",
  description: "List of all League of Legends Stories.",
};
export default AllStories;
